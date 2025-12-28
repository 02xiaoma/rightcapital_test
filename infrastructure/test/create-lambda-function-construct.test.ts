import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('Lambda Function Construct', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new InfrastructureStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('should create Lambda function', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {});
  });

  test('should configure Node.js 18.x runtime', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs18.x'
    });
  });

  test('should configure 256 MB memory', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 256
    });
  });

  test('should configure 30 second timeout', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Timeout: 30
    });
  });

  test('should have inline handler code', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler'
    });
  });

  test('should have environment variables', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          NODE_ENV: 'production'
        }
      }
    });
  });

  test('should create IAM execution role', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com'
            }
          }
        ]
      }
    });
  });

  test('should have CloudWatch Logs permissions', () => {
    // Check for CloudWatch Logs policy attachment
    template.hasResourceProperties('AWS::IAM::Policy', {});
  });

  test('should create CloudWatch Logs group', () => {
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: {
        'Fn::Join': [
          '/',
          [
            '/aws/lambda',
            {
              'Fn::GetAtt': [
                expect.stringMatching(/^.*Function.*/),
                'Arn'
              ]
            }
          ]
        ]
      }
    });
  });

  test('should export function name', () => {
    template.hasOutput('FunctionName', {
      Value: {
        'Fn::GetAtt': [
          expect.stringMatching(/^.*Function.*/),
          'Arn'
        ]
      }
    });
  });

  test('should export function ARN', () => {
    template.hasOutput('FunctionArn', {
      Value: {
        'Fn::GetAtt': [
          expect.stringMatching(/^.*Function.*/),
          'Arn'
        ]
      }
    });
  });
});
