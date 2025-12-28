import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class InfrastructureStack extends cdk.Stack {
  public readonly table: dynamodb.TableV2;
  public readonly tableName: string;
  public readonly tableArn: string;

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

    // Export table properties for cross-stack references
    this.tableName = this.table.tableName;
    this.tableArn = this.table.tableArn;

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
  }
}
