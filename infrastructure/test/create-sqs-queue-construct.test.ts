import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('SQS Queue Construct', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new InfrastructureStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('should create SQS queue', () => {
    template.hasResourceProperties('AWS::SQS::Queue', {});
  });

  test('should configure visibility timeout to 30 seconds', () => {
    template.hasResourceProperties('AWS::SQS::Queue', {
      VisibilityTimeout: 30
    });
  });

  test('should set message retention period to 4 days', () => {
    // 4 days = 4 * 24 * 60 * 60 = 345600 seconds
    template.hasResourceProperties('AWS::SQS::Queue', {
      MessageRetentionPeriod: 345600
    });
  });

  test('should enable encryption with SQS managed keys', () => {
    template.hasResourceProperties('AWS::SQS::Queue', {
      SqsManagedSseEnabled: true
    });
  });

  test('should create CloudWatch alarm for queue depth', () => {
    template.resourceCountIs('AWS::CloudWatch::Alarm', 3); // DynamoDB + SQS alarms
  });

  test('should export queue URL', () => {
    template.hasOutput('QueueUrl', {
      Value: {
        'Fn::GetAtt': [
          expect.stringMatching(/^.*Queue.*/),
          'QueueUrl'
        ]
      }
    });
  });

  test('should export queue ARN', () => {
    template.hasOutput('QueueArn', {
      Value: {
        'Fn::GetAtt': [
          expect.stringMatching(/^.*Queue.*/),
          'Arn'
        ]
      }
    });
  });

  test('should have standard queue type', () => {
    // Standard queue doesn't have FifoQueue property set to true
    const queues = template.findResources('AWS::SQS::Queue');
    const queueLogicalId = Object.keys(queues)[0];
    const queue = queues[queueLogicalId];

    // FifoQueue should be undefined or false for standard queue
    expect(queue.Properties.FifoQueue).toBeUndefined();
  });
});
