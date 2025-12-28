# Implementation Context: Create Lambda Function Construct

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS CDK v2, TypeScript, Lambda, Node.js
- **Current Infrastructure**: Basic CDK project with DynamoDB table and SQS queue

## Requirements Analysis
The task requires creating a Lambda function construct for the API handler with basic functionality.

### Functional Requirements
- Create Lambda function with Node.js runtime (18.x+)
- Implement basic handler returning 200 OK for POST requests
- Configure 256 MB memory and 30 second timeout
- Set up environment variables for configuration
- Configure CloudWatch Logs with retention
- Create IAM execution role with minimal permissions
- Export function ARN and name for API Gateway integration

### Non-Functional Requirements
- Follow CDK best practices for serverless functions
- Ensure proper logging and monitoring setup
- Provide minimal IAM permissions for security
- Support future extensibility for validation logic

### Acceptance Criteria
- Lambda function created with correct runtime and configuration
- Basic handler returns 200 OK for valid requests
- CloudWatch Logs group created with function logs
- IAM role configured with appropriate permissions
- Function properties exported correctly

## Existing Documentation
**Design Document**: design/detailed-design.md contains Lambda specifications

**Previous Implementation**: CDK project with infrastructure components

## Dependencies & Technology Stack
- **AWS CDK**: Lambda constructs from aws-cdk-lib/aws-lambda
- **Infrastructure Stack**: Existing InfrastructureStack class to extend
- **Node.js**: Lambda handler implementation
- **CloudWatch**: Logging and monitoring setup

## Implementation Paths
- **Code Location**: infrastructure/lib/ directory
- **Test Location**: infrastructure/test/ directory
- **Integration**: Add Lambda construct to InfrastructureStack

## Patterns & Best Practices
- **Lambda Constructs**: Use Function construct with inline code
- **Runtime**: Node.js 18.x for modern JavaScript features
- **Memory/Timeout**: Balanced configuration for cost/performance
- **IAM**: Principle of least privilege
- **Logging**: CloudWatch integration with retention

## Key Design Decisions
- **Runtime**: Node.js 18.x (LTS with modern features)
- **Memory**: 256 MB (sufficient for basic processing)
- **Timeout**: 30 seconds (matches SQS visibility timeout)
- **Handler**: Inline code for initial implementation
- **Environment**: Basic configuration variables
- **Permissions**: CloudWatch Logs access only

## Risks & Considerations
- Handler code will need expansion for validation logic
- Environment variables should be configurable
- IAM permissions will need expansion for DynamoDB/SQS access
- Memory/timeout may need adjustment based on load

## Summary
This task creates the Lambda function construct that provides the initial API handler for the notification system, establishing the foundation for request processing and future feature development.
