import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class InfrastructureStack extends cdk.Stack {
  public readonly table: dynamodb.TableV2;
  public readonly tableName: string;
  public readonly tableArn: string;
  public readonly queue: sqs.Queue;
  public readonly queueUrl: string;
  public readonly queueArn: string;

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
  }
}
