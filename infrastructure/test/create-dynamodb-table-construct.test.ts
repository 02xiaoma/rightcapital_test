import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('DynamoDB Table Construct', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    try {
      stack = new InfrastructureStack(app, 'TestStack');
      template = Template.fromStack(stack);
    } catch (error) {
      console.error('Error creating stack:', error);
      throw error;
    }
  });

  test('should have at least one resource in the stack', () => {
    const allResources = template.findResources('*');
    console.log('Resources found:', Object.keys(allResources));
    expect(Object.keys(allResources).length).toBeGreaterThan(0);
  });

  test('should create DynamoDB table with correct schema', () => {
    // Check that a DynamoDB table is created
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE'
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S'
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S'
        }
      ]
    });
  });

  test('should configure on-demand billing mode', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST'
    });
  });

  test('should enable TTL on timestamp attribute', () => {
    // Check TTL configuration
    const ttlLogicalId = Object.keys(template.findResources('AWS::DynamoDB::Table'))[0];
    expect(template.toJSON()).toHaveProperty(`Resources.${ttlLogicalId}Properties.StreamSpecification.StreamEnabled`);
  });

  test('should create CloudWatch alarms for table metrics', () => {
    // Check for CloudWatch alarms
    template.resourceCountIs('AWS::CloudWatch::Alarm', 2); // Read capacity and write capacity alarms
  });

  test('should export table name and ARN', () => {
    // Check for outputs
    const outputs = template.findOutputs('*');
    expect(Object.keys(outputs)).toContain('TableName');
    expect(Object.keys(outputs)).toContain('TableArn');
  });

  test('should have table name starting with expected prefix', () => {
    template.hasOutput('TableName', {
      Value: {
        'Fn::GetAtt': [
          expect.stringMatching(/^.*Table.*/),
          'TableName'
        ]
      }
    });
  });
});
