import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfrastructureStack extends cdk.Stack {
  public readonly table: dynamodb.TableV2;
  public readonly tableName: string;
  public readonly tableArn: string;
  public readonly queue: sqs.Queue;
  public readonly queueUrl: string;
  public readonly queueArn: string;
  public readonly function: lambda.Function;
  public readonly functionName: string;
  public readonly functionArn: string;
  public readonly api: apigateway.RestApi;
  public readonly apiEndpoint: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log('Creating InfrastructureStack...');

    // Create DynamoDB table for message deduplication and status tracking
    this.table = new dynamodb.TableV2(this, 'MessageTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      // Enable TTL for automatic cleanup
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
    });

    console.log('DynamoDB table created:', this.table.tableName);

    // Create SQS queue for message buffering
    this.queue = new sqs.Queue(this, 'MessageQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
    });

    console.log('SQS queue created:', this.queue.queueName);

    // Add CloudWatch alarm for SQS queue depth
    const queueDepthAlarm = new cloudwatch.Alarm(this, 'QueueDepthAlarm', {
      alarmName: `${this.stackName}-SQS-QueueDepth`,
      alarmDescription: 'SQS queue has too many messages',
      metric: this.queue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1000,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // Create Lambda function for API handler
    this.function = new lambda.Function(this, 'ApiHandlerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Received event:', JSON.stringify(event, null, 2));

          // Basic response for POST requests
          if (event.httpMethod === 'POST' || event.requestContext?.http?.method === 'POST') {
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
              },
              body: JSON.stringify({
                message: 'Request accepted',
                timestamp: new Date().toISOString(),
                requestId: event.requestContext?.requestId || 'unknown'
              })
            };
          }

          // Handle OPTIONS for CORS
          if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
              },
              body: ''
            };
          }

          // Default response
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              error: 'Method not allowed',
              message: 'Only POST requests are supported'
            })
          };
        };
      `),
      handler: 'index.handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production'
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    console.log('Lambda function created:', this.function.functionName);

    // Create API Gateway REST API
    this.api = new apigateway.RestApi(this, 'NotificationApi', {
      restApiName: 'NotificationAPI',
      description: 'API for submitting notification requests',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Create /message resource
    const messageResource = this.api.root.addResource('message');

    // Add POST method with Lambda integration
    messageResource.addMethod('POST', new apigateway.LambdaIntegration(this.function));

    // Create usage plan and API key for rate limiting
    const usagePlan = this.api.addUsagePlan('NotificationUsagePlan', {
      name: 'Notification API Usage Plan',
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      quota: {
        limit: 10000,
        period: apigateway.Period.DAY,
      },
    });

    const apiKey = this.api.addApiKey('NotificationApiKey', {
      apiKeyName: 'Notification API Key',
    });

    usagePlan.addApiKey(apiKey);

    console.log('API Gateway created:', this.api.restApiName);

    // Export properties
    this.functionName = this.function.functionName;
    this.functionArn = this.function.functionArn;
    this.apiEndpoint = this.api.url;

    // Export table properties for cross-stack references
    this.tableName = this.table.tableName;
    this.tableArn = this.table.tableArn;
    this.queueUrl = this.queue.queueUrl;
    this.queueArn = this.queue.queueArn;

    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB table name for message storage',
      exportName: `${this.stackName}-TableName`,
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      description: 'DynamoDB table ARN for message storage',
      exportName: `${this.stackName}-TableArn`,
    });

    new cdk.CfnOutput(this, 'QueueUrl', {
      value: this.queue.queueUrl,
      description: 'SQS queue URL for message processing',
      exportName: `${this.stackName}-QueueUrl`,
    });

    new cdk.CfnOutput(this, 'QueueArn', {
      value: this.queue.queueArn,
      description: 'SQS queue ARN for message processing',
      exportName: `${this.stackName}-QueueArn`,
    });

    new cdk.CfnOutput(this, 'FunctionName', {
      value: this.function.functionName,
      description: 'Lambda function name for API handler',
      exportName: `${this.stackName}-FunctionName`,
    });

    new cdk.CfnOutput(this, 'FunctionArn', {
      value: this.function.functionArn,
      description: 'Lambda function ARN for API handler',
      exportName: `${this.stackName}-FunctionArn`,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway endpoint URL for notification submission',
      exportName: `${this.stackName}-ApiEndpoint`,
    });
  }
}
