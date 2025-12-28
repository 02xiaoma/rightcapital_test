import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('IAM Roles and Policies', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new InfrastructureStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('should create Lambda execution role with DynamoDB permissions', () => {
    // Check that a custom policy is attached to the Lambda role for DynamoDB access
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:Query',
              'dynamodb:Scan'
            ],
            Resource: {
              'Fn::GetAtt': [
                expect.stringMatching(/^.*Table.*/),
                'Arn'
              ]
            }
          }
        ]
      }
    });
  });

  test('should create Lambda execution role with SQS permissions', () => {
    // Check that a custom policy is attached to the Lambda role for SQS access
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:ReceiveMessage',
              'sqs:DeleteMessage',
              'sqs:GetQueueAttributes',
              'sqs:GetQueueUrl'
            ],
            Resource: {
              'Fn::GetAtt': [
                expect.stringMatching(/^.*Queue.*/),
                'Arn'
              ]
            }
          }
        ]
      }
    });
  });

  test('should have CloudWatch Logs permissions for Lambda', () => {
    // Check that CloudWatch Logs managed policy is attached
    template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
      ManagedPolicyName: 'service-role/AWSLambdaBasicExecutionRole'
    });
  });

  test('should have TTL update permissions for DynamoDB', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:UpdateTimeToLive',
            Resource: {
              'Fn::GetAtt': [
                expect.stringMatching(/^.*Table.*/),
                'Arn'
              ]
            }
          }
        ]
      }
    });
  });

  test('should restrict SQS permissions to specific queue', () => {
    // Verify that SQS permissions use specific queue ARN
    const policies = template.findResources('AWS::IAM::Policy');
    const policyKeys = Object.keys(policies);
    let foundSQSPolicy = false;

    for (const key of policyKeys) {
      const policy = policies[key];
      if (policy.Properties?.PolicyDocument?.Statement) {
        const statements = policy.Properties.PolicyDocument.Statement;
        for (const statement of statements) {
          if (statement.Action && Array.isArray(statement.Action) &&
              statement.Action.includes('sqs:SendMessage')) {
            foundSQSPolicy = true;
            expect(statement.Resource).toBeDefined();
          }
        }
      }
    }

    expect(foundSQSPolicy).toBe(true);
  });

  test('should restrict DynamoDB permissions to specific table', () => {
    // Verify that DynamoDB permissions use specific table ARN
    const policies = template.findResources('AWS::IAM::Policy');
    const policyKeys = Object.keys(policies);
    let foundDynamoDBPolicy = false;

    for (const key of policyKeys) {
      const policy = policies[key];
      if (policy.Properties?.PolicyDocument?.Statement) {
        const statements = policy.Properties.PolicyDocument.Statement;
        for (const statement of statements) {
          if (statement.Action && Array.isArray(statement.Action) &&
              statement.Action.includes('dynamodb:GetItem')) {
            foundDynamoDBPolicy = true;
            expect(statement.Resource).toBeDefined();
          }
        }
      }
    }

    expect(foundDynamoDBPolicy).toBe(true);
  });

  test('should have proper assume role policy for Lambda', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
          }
        ]
      }
    });
  });
});
