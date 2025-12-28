# Task: Re-queue Messages for Retry Attempts

## Description>
Implement message re-queuing logic to schedule failed deliveries for retry with calculated backoff delays using SQS MessageDelaySeconds.

## Background>
When deliveries fail but are eligible for retry, messages must be re-queued with appropriate delays to allow time for transient issues to resolve. SQS MessageDelaySeconds provides the mechanism to schedule delayed message availability.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Re-queue failed messages using SQS sendMessage with MessageDelaySeconds
2. Use calculated backoff delay from exponential backoff function
3. Preserve original message content and metadata
4. Increment attempt count in message attributes
5. Handle re-queuing failures gracefully
6. Ensure messages don't get stuck in infinite retry loops
7. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Retry information updates from previous task
- Exponential backoff calculation
- SQS sendMessage with delay capability
- Message format preservation

## Implementation Approach
1. Create re-queuing function with delay parameter
2. Integrate backoff calculation for delay values
3. Preserve message content and add retry metadata
4. Handle SQS send failures during re-queuing
5. Test delayed message reappearance in queue
6. Validate retry scheduling prevents infinite loops

## Acceptance Criteria

1. **Delayed Re-queuing**
   - Given failed delivery eligible for retry
   - When message is re-queued
   - Then MessageDelaySeconds is set to backoff delay

2. **Message Preservation**
   - Given original message content
   - When re-queued
   - Then all delivery information is preserved

3. **Attempt Tracking**
   - Given retry attempt
   - When message is re-queued
   - Then attempt count is incremented in message

4. **Delay Calculation**
   - Given attempt number
   - When delay is calculated
   - Then exponential backoff with jitter is applied

5. **Queue Visibility**
   - Given delayed message
   - When delay expires
   - Then message becomes visible for reprocessing

## Metadata
- **Complexity**: Medium
- **Labels**: SQS, Message Re-queuing, Retry Scheduling, Delay Management, Exponential Backoff
- **Required Skills**: AWS SDK, SQS MessageDelaySeconds, Message Attributes, Queue Management
