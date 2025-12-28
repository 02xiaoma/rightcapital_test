# Implementation Context: Update DynamoDB Status to QUEUED

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, DynamoDB, Node.js, Status Tracking
- **Current Infrastructure**: Complete Lambda function with validation, deduplication, storage, and queuing

## Requirements Analysis
The task requires updating the message status in DynamoDB to "QUEUED" after successful SQS message sending, enabling comprehensive status tracking throughout the async processing pipeline.

### Functional Requirements
- Update DynamoDB message record status to "QUEUED" after successful SQS send
- Use conditional update to ensure atomic status transitions from "PENDING"
- Preserve all existing metadata while updating only the status field
- Handle DynamoDB update operation errors gracefully
- Implement rollback mechanism if SQS send fails after status update
- Maintain data consistency across status transitions

### Non-Functional Requirements
- Atomic status updates to prevent race conditions
- Conditional updates to ensure valid state transitions
- Minimal performance impact on the request processing flow
- Comprehensive error handling for update operation failures
- Rollback capability for failed SQS operations
- Audit trail of status changes for monitoring

### Acceptance Criteria
- Message status changes to QUEUED after successful SQS send operation
- Conditional updates prevent invalid status transitions
- Atomic operations ensure data consistency
- Rollback mechanism handles SQS failures appropriately
- Update errors are handled with appropriate SYSTEM_ERROR responses
- All existing metadata is preserved during status updates

## Existing Documentation
**Design Document**: design/detailed-design.md contains status tracking specifications

**Previous Implementation**: Lambda handler with validation, deduplication, storage, and queuing

## Dependencies & Technology Stack
- **Current Lambda Handler**: Existing validation, deduplication, storage, and queuing logic
- **DynamoDB Table**: Existing table with message records and composite key structure
- **AWS SDK**: DynamoDB updateItem operation with conditional expressions
- **Status Lifecycle**: Understanding of PENDING → QUEUED → PROCESSING → COMPLETED flow
- **Error Handling**: Existing error response formatting for SYSTEM_ERROR cases

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (extend Lambda code)
- **Test Location**: infrastructure/test/ directory (add status update tests)
- **Integration**: Add status update logic after successful SQS send

## Patterns & Best Practices
- **Conditional Updates**: Use DynamoDB condition expressions for atomic transitions
- **Status Lifecycle**: Standardized status values for tracking and monitoring
- **Error Recovery**: Rollback mechanisms for failed operations
- **Atomic Operations**: Ensure consistency during state transitions
- **Metadata Preservation**: Update only status field, preserve all other data
- **Audit Trail**: Logging of status changes for debugging and monitoring

## Key Design Decisions
- **Conditional Expression**: Use `attribute_exists(pk) AND #status = :currentStatus` for safe transitions
- **Status Values**: QUEUED status indicates message successfully queued for processing
- **Rollback Logic**: Revert to PENDING status if SQS send fails after update
- **Error Handling**: SYSTEM_ERROR responses for DynamoDB update failures
- **Atomic Updates**: Single updateItem call with condition expression
- **Metadata Integrity**: Preserve all existing fields during status update

## Risks & Considerations
- **Race Conditions**: Concurrent updates could cause status conflicts
- **Conditional Update Failures**: Invalid state transitions could block processing
- **Rollback Complexity**: Status rollback logic could introduce inconsistencies
- **Performance Impact**: Additional DynamoDB operations increase latency
- **Error Scenarios**: Update failures could leave messages in incorrect states
- **Monitoring Gaps**: Status tracking issues could hide processing problems

## Summary
This task implements atomic status updates in DynamoDB to track message progression through the async processing pipeline, ensuring reliable state management and enabling comprehensive monitoring of the notification system.
