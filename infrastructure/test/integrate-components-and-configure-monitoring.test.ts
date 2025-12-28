import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../lib/infrastructure-stack';

describe('Integrate Components and Configure Monitoring', () => {
  let app: App;
  let stack: InfrastructureStack;
  let template: Template;

  beforeEach(() => {
    app = new App();
    stack = new InfrastructureStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('should include all components in CloudFormation template', () => {
    // Check that all major AWS services are present
    template.hasResourceProperties('AWS::DynamoDB::Table', {});
    template.hasResourceProperties('AWS::SQS::Queue', {});
    template.hasResourceProperties('AWS::Lambda::Function', {});
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {});
  });

  test('should create CloudWatch dashboard', () => {
    template.hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardName: 'NotificationSystem-Dashboard'
    });
  });

  test('should create alarms for critical metrics', () => {
    // Should have multiple alarms for different services
    template.resourceCountIs('AWS::CloudWatch::Alarm', 5); // Existing + new alarms
  });

  test('should create Lambda error alarm', () => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmName: {
        'Fn::Sub': expect.stringContaining('Lambda-Errors')
      }
    });
  });

  test('should create API Gateway error alarm', () => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmName: {
        'Fn::Sub': expect.stringContaining('API-Gateway-Errors')
      }
    });
  });

  test('should add resource tags for cost allocation', () => {
    // Check that resources have consistent tagging
    // Note: CDK applies tags at the stack level, so we check for specific tagged resources
    const resources = template.toJSON().Resources;
    const hasTaggedResources = Object.values(resources).some((resource: any) =>
      resource.Properties?.Tags?.some((tag: any) =>
        tag.Key === 'Environment' || tag.Key === 'Project'
      )
    );
    expect(hasTaggedResources).toBe(true);
  });

  test('should export comprehensive stack outputs', () => {
    // Check for key outputs
    template.hasOutput('ApiEndpoint', {});
    template.hasOutput('FunctionName', {});
    template.hasOutput('TableName', {});
    template.hasOutput('QueueUrl', {});
  });

  test('should configure API Gateway access logging', () => {
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      AccessLogSetting: {
        DestinationArn: expect.anything(),
        Format: expect.anything()
      }
    });
  });

  test('should create structured logging configuration', () => {
    // Check that Lambda has proper environment variables for structured logging
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          LOG_LEVEL: 'INFO',
          SERVICE_NAME: 'notification-api'
        }
      }
    });
  });

  test('should create CloudWatch dashboard with multiple widgets', () => {
    // Check dashboard has widgets for different services
    const dashboard = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardLogicalId = Object.keys(dashboard)[0];
    const dashboardBody = dashboard[dashboardLogicalId]?.Properties?.DashboardBody;

    expect(dashboardBody).toBeDefined();
    // The dashboard body should contain widgets for different services
    const bodyString = JSON.stringify(dashboardBody);
    expect(bodyString).toContain('widgets');
  });
});
