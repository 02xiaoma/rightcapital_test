# Task: Update Worker to Handle Max Retry Exceeded

## Description>
Modify the worker Lambda to detect when messages have exceeded maximum retry attempts and prepare them for DLQ movement.

## Background>
When messages reach the maximum retry count, the worker needs to recognize this condition and ensure proper handling before the redrive policy moves them to DLQ. This includes final status updates and logging for operational visibility.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Check message attempt count against maximum retry limit (3)
2. Update DynamoDB status to final failure state for exhausted retries
3. Add detailed error logging for DLQ-bound messages
4. Ensure messages are not re-queued when max retries exceeded
5. Prepare message metadata for DLQ inspection
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Retry tracking from Step 6
- Worker processing logic from Step 4
- Redrive policy configuration from previous task

## Implementation Approach
1. Update worker to check attempt count before retry logic
2. Add max retry detection and special handling
3. Update DynamoDB with final failure status
4. Log detailed information for troubleshooting
5. Ensure redrive policy will activate for these messages
6. Test max retry handling with sample messages

## Acceptance Criteria

1. **Max Retry Detection**
   - Given message with attempt count = 3
   - When worker processes
   - Then max retry exceeded condition is detected

2. **Final Status Update**
   - Given exhausted retry message
   - When processed
   - Then DynamoDB status is set to permanent failure

3. **No Re-queuing**
   - Given max retry exceeded
   - When retry logic runs
   - Then message is not re-queued for another attempt

4. **Detailed Logging**
   - Given failed message reaching DLQ threshold
   - When processed
   - Then comprehensive error details are logged

5. **Redrive Policy Trigger**
   - Given max retry message
   - When worker completes processing
   - Then message becomes eligible for DLQ movement

## Metadata
- **Complexity**: Low
- **Labels**: Lambda, Retry Logic, DLQ, Error Handling, Final Failure
- **Required Skills**: AWS SDK, Lambda Event Processing, Error Classification, Logging
