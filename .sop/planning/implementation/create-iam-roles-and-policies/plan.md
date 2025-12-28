# Implementation Plan: Create IAM Roles and Policies

## Test Strategy

### Test Scenarios
Tests focus on IAM role and policy configuration validation.

1. **Lambda Execution Role Test**
   - Verify Lambda role exists and has correct assume role policy
   - Check attached managed policies (CloudWatch Logs)
   - Validate custom inline policies for DynamoDB and SQS access

2. **DynamoDB Permissions Test**
   - Confirm DynamoDB table read/write permissions in custom policy
   - Verify resource ARN restrictions limit access to specific table
   - Check TTL update permissions for cleanup operations

3. **SQS Permissions Test**
   - Validate SQS send/receive message permissions
   - Confirm queue URL access is restricted to specific queue
   - Check message attribute and visibility timeout permissions

4. **CloudWatch Permissions Test**
   - Verify CloudWatch Logs create/write permissions
   - Confirm metrics publishing capabilities
   - Check log group and stream management permissions

5. **API Gateway Service Role Test**
   - Validate API Gateway service role configuration
   - Confirm CloudWatch Logs access for API logging
   - Check execution role attachment to API Gateway

6. **Policy Attachment Test**
   - Verify all policies are properly attached to roles
   - Confirm no conflicting permissions
   - Validate policy precedence and effect

### Testing Approach
- Use CDK testing framework with template assertions
- Test CloudFormation resource properties for IAM resources
- Validate policy documents and role configurations
- Include integration tests for policy attachment verification

## Implementation Strategy

### High-Level Architecture
- Enhance existing Lambda function with custom IAM role
- Create additional policies for DynamoDB and SQS access
- Configure API Gateway with proper service role
- Maintain principle of least privilege throughout
- Use resource-based permissions for security

### Key Implementation Tasks
1. Import IAM constructs from CDK
2. Create custom policies for DynamoDB and SQS access
3. Enhance Lambda execution role with additional permissions
4. Configure API Gateway service role for logging
5. Attach policies to appropriate roles
6. Validate role configurations and permissions

### Dependencies
- AWS CDK IAM library
- Existing InfrastructureStack class
- Previously created DynamoDB table and SQS queue
- Lambda and API Gateway constructs

## Risk Assessment
- **Permission Issues**: Insufficient permissions could break functionality
- **Security Risks**: Over-permissive policies create security vulnerabilities
- **Complexity**: IAM policy management can become complex
- **Testing**: IAM changes require thorough testing
- **Compliance**: Must meet security and compliance requirements

## Success Criteria
- Lambda execution role has all required permissions
- DynamoDB and SQS access is properly restricted
- CloudWatch logging and metrics are enabled
- API Gateway has appropriate service role
- All policies follow least privilege principle
