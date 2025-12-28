# Task: Handle SQS Send Failures Gracefully

## Description
Implement comprehensive error handling for SQS send operation failures, including rollback of DynamoDB status and appropriate client responses.

## Background
Reliability requires graceful handling of all failure scenarios. When SQS send operations fail, the system must maintain data consistency by rolling back status changes and providing clear error messages to clients, preventing orphaned records or inconsistent state.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Detect SQS send operation failures and handle different error types
2. Rollback DynamoDB status from QUEUED back to PENDING on send failure
3. Implement retry logic for transient SQS errors
4. Return appropriate error responses to clients for permanent failures
5. Log detailed error information for debugging
6. Maintain data consistency across all operations
7. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed SQS sending and status update functionality
- AWS SDK error handling patterns
- Understanding of SQS error types and retry strategies

## Implementation Approach
1. Implement comprehensive error handling for SQS sendMessage failures
2. Add rollback logic for DynamoDB status updates
3. Differentiate between retryable and non-retryable errors
4. Implement retry mechanism for transient failures
5. Add detailed error logging and correlation IDs
6. Test failure scenarios and rollback behavior

## Acceptance Criteria

1. **Send Failure Detection**
   - Given SQS service unavailable
   - When send operation fails
   - Then failure is detected and handled appropriately

2. **Status Rollback**
   - Given failed SQS send after status update
   - When error handling runs
   - Then DynamoDB status is rolled back to PENDING

3. **Error Differentiation**
   - Given different SQS error types
   - When failures occur
   - Then retryable vs permanent errors are handled differently

4. **Client Response**
   - Given permanent SQS failure
   - When request processing fails
   - Then appropriate 5xx error is returned to client

5. **Data Consistency**
   - Given any failure scenario
   - When operations complete
   - Then system maintains consistent state across DynamoDB and SQS

## Metadata
- **Complexity**: Medium
- **Labels**: Error Handling, SQS, DynamoDB, Rollback, Data Consistency
- **Required Skills**: AWS SDK, Error Handling, Transaction Management, Retry Logic
