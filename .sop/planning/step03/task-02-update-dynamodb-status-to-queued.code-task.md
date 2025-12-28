# Task: Update DynamoDB Status to QUEUED

## Description
Update the message status in DynamoDB to "QUEUED" after successful SQS message sending, enabling status tracking throughout the async processing pipeline.

## Background
Status tracking is essential for monitoring message progress through the system. Updating the status to QUEUED after successful queueing allows the system to distinguish between messages that are pending, queued for processing, actively being processed, or completed.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Update DynamoDB message record status to "QUEUED" after successful SQS send
2. Use conditional update to ensure atomic status transitions
3. Preserve all existing metadata while updating status
4. Handle DynamoDB update operation errors gracefully
5. Rollback status if SQS send fails after storage
6. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed SQS message sending functionality
- DynamoDB table from Step 1 infrastructure
- AWS SDK DynamoDB update operation
- Understanding of conditional updates and atomic operations

## Implementation Approach
1. Implement DynamoDB update operation for status change
2. Add conditional expression to ensure valid state transitions
3. Integrate status update with SQS send success/failure handling
4. Add error handling for update failures
5. Test status transitions with various scenarios
6. Deploy updated function via CDK

## Acceptance Criteria

1. **Status Update Success**
   - Given successful SQS send
   - When status update completes
   - Then DynamoDB record shows status as QUEUED

2. **Conditional Update**
   - Given message in PENDING status
   - When update operation runs
   - Then status changes only if current status is PENDING

3. **Atomic Operation**
   - Given SQS send failure after status update
   - When error handling runs
   - Then status is rolled back to previous state

4. **Update Error Handling**
   - Given DynamoDB update failure
   - When operation fails
   - Then appropriate error response is returned

5. **Metadata Preservation**
   - Given existing record data
   - When status is updated
   - Then all other fields remain unchanged

## Metadata
- **Complexity**: Low
- **Labels**: DynamoDB, Status Tracking, Lambda, State Management, Atomic Operations
- **Required Skills**: AWS SDK, DynamoDB, Conditional Updates, Error Handling
