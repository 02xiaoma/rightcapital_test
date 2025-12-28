# Implementation Plan: Update DynamoDB Status to QUEUED

## Test Strategy

### Test Scenarios
Tests focus on status update operations and atomic state transitions in DynamoDB.

1. **Status Update Success Test**
   - Verify message status changes to QUEUED after successful SQS send
   - Confirm conditional update prevents invalid transitions
   - Validate all other metadata remains unchanged

2. **Conditional Update Test**
   - Test that status only updates when current status is PENDING
   - Verify conditional expression prevents race conditions
   - Confirm atomic operation behavior

3. **Rollback Mechanism Test**
   - Test rollback to PENDING status when SQS send fails after update
   - Verify error handling maintains data consistency
   - Confirm rollback preserves original state

4. **Update Error Handling Test**
   - Mock DynamoDB update failures and throttling
   - Verify appropriate SYSTEM_ERROR responses for update failures
   - Test graceful error handling without exposing internal details

5. **Metadata Preservation Test**
   - Verify all existing fields remain unchanged during status update
   - Test that only status field is modified
   - Confirm TTL and other metadata integrity

6. **Integration Test**
   - Test complete flow: validation → deduplication → storage → queuing → status update
   - Verify status tracking through the entire pipeline
   - Confirm error scenarios maintain consistent state

### Testing Approach
- Unit tests for status update logic and conditional expressions
- Integration tests with mocked DynamoDB operations
- Mock API Gateway events with valid message data
- Test error scenarios with DynamoDB service failures
- Validate status transitions and data consistency

## Implementation Strategy

### High-Level Architecture
- Add status update logic after successful SQS message sending
- Implement conditional DynamoDB update to ensure atomic transitions
- Handle update errors gracefully with rollback mechanisms
- Preserve all existing metadata during status updates
- Maintain data consistency across the processing pipeline

### Key Implementation Tasks
1. Implement DynamoDB updateItem operation with conditional expression
2. Add status update logic after successful SQS send
3. Implement rollback mechanism for failed SQS operations
4. Handle update operation errors gracefully
5. Update success response to reflect status changes
6. Test status transitions with various scenarios
7. Deploy updated Lambda function via CDK

### Dependencies
- **Existing Lambda Handler**: Validation, deduplication, storage, and queuing logic
- **DynamoDB Table**: Existing table with message records and status tracking
- **AWS SDK**: DynamoDB updateItem operation with condition expressions
- **Status Lifecycle**: Understanding of PENDING → QUEUED state transition
- **Error Handling**: Existing error response formatting for SYSTEM_ERROR cases

## Risk Assessment
- **Race Conditions**: Concurrent status updates could cause conflicts
- **Conditional Update Failures**: Invalid transitions could block processing
- **Rollback Inconsistencies**: Status rollback could introduce data issues
- **Performance Overhead**: Additional DynamoDB operations increase latency
- **State Corruption**: Update failures could leave messages in wrong states
- **Monitoring Blind Spots**: Status tracking issues could hide problems

## Success Criteria
- Message status changes to QUEUED after successful SQS send operation
- Conditional updates prevent invalid status transitions
- Atomic operations ensure data consistency during updates
- Rollback mechanism handles SQS failures appropriately
- Update errors are handled with appropriate SYSTEM_ERROR responses
- All existing metadata is preserved during status updates
