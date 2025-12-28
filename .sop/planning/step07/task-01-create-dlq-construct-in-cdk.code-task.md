# Task: Create DLQ Construct in CDK

## Description>
Implement a CDK construct for the Dead Letter Queue to handle messages that have exhausted all retry attempts.

## Background>
The Dead Letter Queue provides a safe storage location for messages that cannot be delivered after maximum retries. This allows for manual inspection, debugging, and potential reprocessing of problematic messages without losing them.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Create SQS queue construct specifically for dead letters
2. Configure longer retention period for DLQ (14 days)
3. Set up appropriate permissions for DLQ access
4. Add CloudWatch monitoring for DLQ depth
5. Export DLQ ARN for redrive policy configuration
6. Use CDK to deploy with fake account ID (123456789012)

## Dependencies
- Existing SQS queue construct from Step 1
- CDK SQS construct libraries
- Understanding of DLQ best practices

## Implementation Approach
1. Create separate DLQ construct extending base SQS queue
2. Configure retention and visibility settings for dead letters
3. Add IAM permissions for DLQ operations
4. Set up CloudWatch alarms for DLQ activity
5. Test DLQ creation and basic functionality
6. Integrate with main queue redrive policy

## Acceptance Criteria

1. **DLQ Creation**
   - Given CDK construct
   - When synthesized
   - Then separate SQS queue for dead letters is created

2. **Retention Configuration**
   - Given DLQ settings
   - When configured
   - Then message retention is set to 14 days

3. **Access Permissions**
   - Given DLQ IAM setup
   - When deployed
   - Then appropriate permissions are granted for inspection

4. **Monitoring Setup**
   - Given DLQ construct
   - When deployed
   - Then CloudWatch alarms monitor DLQ depth

5. **ARN Export**
   - Given DLQ configuration
   - When referenced
   - Then ARN is available for redrive policy

## Metadata
- **Complexity**: Low
- **Labels**: SQS, DLQ, CDK, Dead Letter Queue, Error Handling
- **Required Skills**: AWS CDK, SQS Configuration, Queue Management, IAM Policies
