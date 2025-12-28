# Implementation Context: Create IAM Roles and Policies

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS CDK v2, TypeScript, IAM, Security Policies
- **Current Infrastructure**: Complete CDK stack with DynamoDB, SQS, Lambda, and API Gateway

## Requirements Analysis
The task requires implementing comprehensive IAM roles and policies for secure access across all AWS services in the notification system.

### Functional Requirements
- Lambda execution role with permissions for DynamoDB, SQS, and CloudWatch
- API Gateway service role for logging and monitoring
- DynamoDB table access policies for read/write operations
- SQS queue permissions for send/receive messages
- CloudWatch permissions for metrics and logs publishing
- Use managed policies where appropriate
- Attach roles to respective services

### Non-Functional Requirements
- Follow AWS IAM best practices and least privilege principle
- Ensure security compliance and auditability
- Minimize custom policies by using managed policies
- Support future extensibility for additional permissions
- Maintain separation of concerns between services

### Acceptance Criteria
- Lambda execution role has appropriate permissions
- API Gateway service role enables CloudWatch logging
- DynamoDB read/write permissions granted
- SQS send/receive permissions configured
- CloudWatch metrics and logs access enabled

## Existing Documentation
**Design Document**: design/detailed-design.md contains security specifications

**Previous Implementation**: All service constructs created with basic IAM

## Dependencies & Technology Stack
- **AWS CDK**: IAM constructs from aws-cdk-lib/aws-iam
- **Infrastructure Stack**: Existing InfrastructureStack class to extend
- **AWS Services**: DynamoDB, SQS, Lambda, API Gateway, CloudWatch
- **IAM Knowledge**: Understanding of roles, policies, and least privilege

## Implementation Paths
- **Code Location**: infrastructure/lib/ directory (modify InfrastructureStack)
- **Test Location**: infrastructure/test/ directory
- **Integration**: Enhance existing service constructs with proper IAM

## Patterns & Best Practices
- **Managed Policies**: Use AWS managed policies where possible
- **Custom Policies**: Create minimal custom policies for specific needs
- **Least Privilege**: Grant only necessary permissions
- **Resource-Based**: Use resource ARNs to limit scope
- **Service Roles**: Separate roles for different services

## Key Design Decisions
- **Lambda Role**: Extend existing auto-generated role with DynamoDB and SQS permissions
- **API Gateway Role**: Use managed policy for CloudWatch Logs
- **Policy Structure**: Combine managed and custom policies
- **Resource ARNs**: Use specific ARNs for table and queue access
- **Permissions Scope**: Limit to specific resources within the stack

## Risks & Considerations
- Over-permissive policies could create security risks
- Under-permissive policies could break functionality
- IAM changes require careful testing
- Policy complexity should be balanced with maintainability
- Future feature additions may require policy updates

## Summary
This task enhances the existing infrastructure with comprehensive IAM roles and policies, ensuring secure and compliant access to all AWS services while maintaining the principle of least privilege.
