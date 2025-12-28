# Task: Create IAM Roles and Policies

## Description
Implement comprehensive IAM roles and policies that provide secure, least-privilege access for all AWS services in the notification system infrastructure.

## Background
Proper IAM configuration is essential for security and compliance. Each component needs appropriate permissions to interact with other services while following the principle of least privilege.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Define Lambda execution role with permissions for DynamoDB, SQS, and CloudWatch
2. Create API Gateway service role for logging and monitoring
3. Set up DynamoDB table access policies for read/write operations
4. Configure SQS queue permissions for send/receive messages
5. Define CloudWatch permissions for metrics and logs publishing
6. Use managed policies where appropriate to reduce custom policy complexity
7. Attach roles to respective services (Lambda, API Gateway)

## Dependencies
- AWS CDK core and IAM construct libraries
- Completed all service constructs (Lambda, API Gateway, DynamoDB, SQS)
- Understanding of AWS IAM best practices and least privilege

## Implementation Approach
1. Import IAM constructs from AWS CDK
2. Define managed policies for common AWS services
3. Create custom policies for specific permissions
4. Set up execution roles for Lambda functions
5. Configure service roles for API Gateway
6. Attach policies to appropriate roles
7. Validate role configurations

## Acceptance Criteria

1. **Lambda Execution Role**
   - Given IAM role definition
   - When checking attached policies
   - Then role has permissions for DynamoDB, SQS, and CloudWatch

2. **API Gateway Service Role**
   - Given service role configuration
   - When examining permissions
   - Then role enables API Gateway to write logs to CloudWatch

3. **DynamoDB Permissions**
   - Given Lambda role policies
   - When checking DynamoDB access
   - Then read/write permissions are granted for the table

4. **SQS Permissions**
   - Given Lambda role policies
   - When checking SQS access
   - Then send/receive permissions are granted for the queue

5. **CloudWatch Permissions**
   - Given service roles
   - When examining monitoring access
   - Then publish metrics and logs permissions are configured

## Metadata
- **Complexity**: Medium
- **Labels**: AWS, IAM, CDK, Security, Infrastructure
- **Required Skills**: AWS CDK, IAM, Security Policies, Least Privilege
