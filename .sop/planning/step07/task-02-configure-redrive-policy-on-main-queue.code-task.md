# Task: Configure Redrive Policy on Main Queue

## Description>
Set up SQS redrive policy to automatically move messages that exceed maximum receive attempts to the Dead Letter Queue.

## Background>
The redrive policy ensures that messages which fail repeatedly (after exhausting retries) are moved to the DLQ for manual inspection rather than being reprocessed indefinitely. This prevents poison message scenarios and provides visibility into delivery failures.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Configure redrive policy on main SQS queue with maxReceiveCount = 3
2. Link policy to DLQ ARN created in previous task
3. Ensure redrive policy activates after retry exhaustion
4. Test policy configuration and message movement
5. Update CDK construct with redrive policy settings
6. Use CDK to deploy updated queue configuration with fake account ID (123456789012)

## Dependencies
- DLQ construct from previous task
- Main SQS queue from Step 1
- Understanding of SQS redrive policies

## Implementation Approach
1. Update main queue CDK construct to include redrive policy
2. Set maxReceiveCount to match retry limit (3 attempts)
3. Reference DLQ ARN in redrive policy configuration
4. Test policy with sample messages exceeding retry count
5. Monitor message movement to DLQ
6. Validate no messages are lost during redrive

## Acceptance Criteria

1. **Policy Configuration**
   - Given main queue CDK construct
   - When updated with redrive policy
   - Then maxReceiveCount is set to 3

2. **DLQ Reference**
   - Given redrive policy
   - When configured
   - Then DLQ ARN is correctly referenced

3. **Message Movement**
   - Given message exceeding maxReceiveCount
   - When processed by queue
   - Then message is moved to DLQ

4. **No Message Loss**
   - Given redrive policy activation
   - When messages are moved
   - Then no messages are lost in transit

5. **Policy Activation**
   - Given retry-exhausted message
   - When redrive policy triggers
   - Then message appears in DLQ for inspection

## Metadata
- **Complexity**: Low
- **Labels**: SQS, Redrive Policy, DLQ, Queue Configuration, Error Handling
- **Required Skills**: AWS CDK, SQS Redrive Policies, Queue Management, Error Recovery
