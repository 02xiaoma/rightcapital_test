# Implementation Context: Handle SQS Send Failures Gracefully

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, SQS, DynamoDB, Error Handling
- **Current Infrastructure**: Complete Lambda function with validation, deduplication, storage, queuing, and status updates

## Requirements Analysis
The task requires implementing comprehensive error handling for SQS send operation failures, ensuring data consistency through rollback mechanisms and appropriate client responses for different failure scenarios.

### Functional Requirements
- Detect SQS sendMessage operation failures and categorize error types
- Implement rollback of DynamoDB status from QUEUED back to PENDING on send failure
- Differentiate between retryable (transient) and non-retryable (permanent) SQS errors
- Implement retry logic with exponential backoff for transient failures
- Return appropriate HTTP error responses to clients for permanent failures
- Log detailed error information with correlation IDs for debugging
- Maintain data consistency across DynamoDB and SQS operations

### Non-Functional Requirements
- Comprehensive error classification and handling
- Minimal performance impact on successful request paths
- Detailed error logging for operational debugging
- Atomic rollback operations to prevent data inconsistency
- Scalable error handling that works at high throughput
- Clear error messages that don't expose sensitive information

### Acceptance Criteria
- SQS send failures are detected and categorized appropriately
- DynamoDB status is rolled back from QUEUED to PENDING on send failures
- Retryable errors trigger automatic retry with backoff
- Permanent errors return appropriate 5xx responses to clients
- System maintains consistent state across all operations
- Detailed error logging enables effective debugging

## Existing Documentation
**Design Document**: design/detailed-design.md contains error handling specifications

**Previous Implementation**: Lambda handler with SQS sending and status update logic

## Dependencies & Technology Stack
- **Current Lambda Handler**: Existing SQS send and status update operations
- **AWS SDK**: SQS sendMessage error handling and retry patterns
- **DynamoDB**: Status rollback operations for failed sends
- **Error Classification**: Understanding of SQS error types and retry strategies
- **Logging**: Structured logging with correlation IDs for error tracking

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (enhance Lambda error handling)
- **Test Location**: infrastructure/test/ directory (add failure scenario tests)
- **Integration**: Enhance SQS send operation with comprehensive error handling

## Patterns & Best Practices
- **Error Classification**: Categorize errors as retryable vs permanent
- **Retry Logic**: Implement exponential backoff for transient failures
- **Rollback Transactions**: Ensure atomic status rollback on failures
- **Circuit Breaker**: Prevent cascade failures during SQS outages
- **Correlation Tracking**: Maintain request IDs through error scenarios
- **Safe Error Messages**: Client responses without sensitive information

## Key Design Decisions
- **Error Classification**: AWS SDK error codes determine retry vs permanent handling
- **Retry Strategy**: Simple retry with backoff for transient SQS errors
- **Rollback Logic**: Immediate status rollback to PENDING on send failures
- **Error Responses**: SYSTEM_ERROR for all SQS failures to maintain abstraction
- **Logging Strategy**: Detailed error logging with correlation IDs
- **Consistency Guarantee**: Rollback ensures no orphaned QUEUED messages

## Risks & Considerations
- **Error Misclassification**: Incorrect retry/permanent error categorization
- **Rollback Failures**: Status rollback could fail, leaving inconsistent state
- **Retry Loops**: Infinite retry loops on persistent transient errors
- **Performance Impact**: Error handling adds latency to failure paths
- **Logging Overhead**: Detailed error logging could impact performance
- **Client Experience**: Error responses must be informative but safe

## Summary
This task implements production-ready error handling for SQS operations, ensuring reliability through comprehensive failure detection, retry logic, and data consistency guarantees in the async processing pipeline.
