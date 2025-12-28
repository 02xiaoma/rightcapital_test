# Task: Update DynamoDB with Retry Information

## Description>
Enhance DynamoDB message records to track retry attempts, next retry timestamps, and retry history for failed deliveries.

## Background>
Retry tracking is essential for implementing the maximum retry limit (3 attempts) and preventing infinite retry loops. Storing retry metadata allows the system to make informed decisions about when to stop retrying and move messages to dead letter queues.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Increment retry attempt counter in DynamoDB
2. Store next retry timestamp based on backoff calculation
3. Record retry history with timestamps and error details
4. Implement max retry limit checking (3 attempts)
5. Handle concurrent retry attempts from multiple workers
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Backoff calculation from previous task
- DynamoDB update operations
- Retry eligibility determination
- Atomic update operations for concurrency

## Implementation Approach
1. Create retry metadata update function
2. Implement attempt counter increment with bounds checking
3. Add next retry timestamp calculation and storage
4. Record retry history in message record
5. Handle max retry limit exceeded scenarios
6. Test concurrent retry handling

## Acceptance Criteria

1. **Attempt Counter Increment**
   - Given failed delivery
   - When retry information is updated
   - Then attempt count is incremented by 1

2. **Next Retry Timestamp**
   - Given backoff delay calculation
   - When retry info is stored
   - Then next retry timestamp is set correctly

3. **Max Retry Limit**
   - Given attempt count reaches 3
   - When retry decision is made
   - Then no further retries are scheduled

4. **Retry History**
   - Given multiple retry attempts
   - When history is recorded
   - Then each attempt has timestamp and error details

5. **Concurrent Safety**
   - Given multiple workers processing same message
   - When updates occur
   - Then retry counters remain consistent

## Metadata
- **Complexity**: Medium
- **Labels**: DynamoDB, Retry Tracking, Attempt Limits, Concurrency Control, Audit Trail
- **Required Skills**: AWS SDK, Conditional Updates, Atomic Operations, Timestamp Handling
