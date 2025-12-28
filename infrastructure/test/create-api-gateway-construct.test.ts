import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('API Gateway Construct', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new InfrastructureStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('should create REST API', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'NotificationAPI'
    });
  });

  test('should create message resource', () => {
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'message'
    });
  });

  test('should create POST method', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      AuthorizationType: 'NONE'
    });
  });

  test('should configure Lambda proxy integration', () => {
    template.hasResourceProperties('AWS::ApiGateway::Integration', {
      Type: 'AWS_PROXY',
      IntegrationHttpMethod: 'POST'
    });
  });

  test('should enable CORS', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS'
    });
  });

  test('should create usage plan', () => {
    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {});
  });

  test('should create API key', () => {
    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {});
  });

  test('should create deployment', () => {
    template.hasResourceProperties('AWS::ApiGateway::Deployment', {});
  });

  test('should create stage', () => {
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'prod'
    });
  });

  test('should export API endpoint URL', () => {
    template.hasOutput('ApiEndpoint', {
      Value: {
        'Fn::Sub': 'https://${RestApi}.execute-api.${AWS::Region}.amazonaws.com/prod'
      }
    });
  });
});
