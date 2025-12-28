# Implementation Context: Create Worker Lambda Construct

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, CDK, Node.js, Event-Driven Architecture
- **Current Infrastructure**: Complete async queuing pipeline ready for message processing

## Requirements Analysis
The task requires creating a CDK construct for a worker Lambda function that will process messages from the SQS queue asynchronously. This worker is the core processing component that handles the actual HTTP request execution, forming the backbone of the message delivery pipeline.

### Functional Requirements
- Create worker Lambda function construct with Node.js runtime and appropriate configuration
- Configure memory allocation (256 MB) and timeout (25 seconds) optimized for HTTP processing
- Set up execution role with comprehensive permissions for DynamoDB, SQS, and CloudWatch operations
- Configure CloudWatch Logs group for structured worker logging with correlation IDs
- Export function ARN for SQS event source mapping integration
- Enable environment variables for service configuration and monitoring

### Non-Functional Requirements
- Optimized resource allocation for cost-effective HTTP request processing
- Comprehensive IAM permissions following principle of least privilege
- Structured logging for operational monitoring and debugging
- Scalable configuration supporting concurrent message processing
- Production-ready error handling and monitoring capabilities

### Acceptance Criteria
- CDK construct creates worker Lambda function with correct runtime and resources
- Function has appropriate memory and timeout settings for HTTP processing
- IAM role includes necessary permissions for DynamoDB, SQS, and CloudWatch
- CloudWatch Logs group configured for worker function logging
- Function ARN exported for event source mapping integration
- Environment variables configured for service operation

## Existing Documentation
**Design Document**: design/detailed-design.md contains worker Lambda specifications

**Current Implementation**: Complete infrastructure stack with API handler and queuing pipeline

## Dependencies & Technology Stack
- **Existing CDK Stack**: Infrastructure stack with DynamoDB table and SQS queue
- **CDK Lambda Constructs**: AWS CDK Lambda function and IAM role constructs
- **Event-Driven Architecture**: Understanding of SQS-triggered Lambda processing
- **Permissions Model**: AWS IAM policies for cross-service operations
- **Monitoring Integration**: CloudWatch logging and metrics integration

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (add worker Lambda construct)
- **Test Location**: infrastructure/test/ directory (add worker construct tests)
- **Integration**: Add worker function to existing infrastructure stack

## Patterns & Best Practices
- **Resource Optimization**: Balance memory and timeout for cost-effective processing
- **IAM Least Privilege**: Grant only necessary permissions for operations
- **Structured Logging**: Implement correlation ID tracking and structured logs
- **Environment Configuration**: Externalize configuration through environment variables
- **Error Handling**: Comprehensive error handling for production reliability
- **Monitoring Integration**: Enable CloudWatch metrics and logging

## Key Design Decisions
- **Memory Allocation**: 256 MB for HTTP processing with good performance/cost ratio
- **Timeout Setting**: 25 seconds to allow HTTP request completion within limits
- **IAM Permissions**: DynamoDB read/write, SQS operations, CloudWatch logging
- **Logging Configuration**: Dedicated CloudWatch Logs group with retention
- **Environment Variables**: Service configuration externalized for flexibility
- **Function Naming**: Clear naming convention for operational identification

## Risks & Considerations
- **Resource Allocation**: Incorrect memory/timeout could cause processing failures
- **Permission Issues**: Insufficient IAM permissions could block operations
- **Logging Overhead**: Excessive logging could impact performance or costs
- **Environment Config**: Missing environment variables could cause runtime failures
- **Event Source Limits**: Lambda concurrency limits could affect throughput
- **Cold Start Impact**: Initial invocation latency for infrequently used workers

## Summary
This task creates the worker Lambda function construct that will serve as the core message processing component, handling HTTP request execution from the SQS queue with comprehensive monitoring, logging, and error handling capabilities.
