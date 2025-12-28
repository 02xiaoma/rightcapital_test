# Task: Implement SQS Message Sending

## Description
Add SQS message sending functionality to the Lambda handler to queue validated and stored messages for asynchronous processing.

## Background
After validation, deduplication, and storage, messages need to be queued for background processing. SQS provides reliable buffering that decouples API acceptance from message delivery, enabling high-throughput async workflows.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Send message details to SQS queue after successful DynamoDB storage
2. Include all necessary message data in queue message (targetUrl, method, headers, body, etc.)
3. Use message attributes for metadata like messageId and correlation ID
4. Handle SQS send operation errors gracefully
5. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed Step 2 validation, deduplication, and storage
- SQS queue from Step 1 infrastructure
- AWS SDK SQS client
- Understanding of SQS message format and attributes

## Implementation Approach
1. Import SQS client into Lambda handler
2. Create queue message payload from validated request data
3. Implement SQS sendMessage operation
4. Add error handling for send failures
5. Test message sending with various payload sizes
6. Deploy updated function via CDK

## Acceptance Criteria

1. **Message Sending**
   - Given validated and stored message
   - When SQS send operation completes
   - Then message appears in SQS queue

2. **Message Content**
   - Given request data
   - When message is sent to queue
   - Then all required fields (targetUrl, method, headers, body) are included

3. **Message Attributes**
   - Given message metadata
   - When sent to SQS
   - Then messageId and correlation ID are set as message attributes

4. **Send Error Handling**
   - Given SQS service failure
   - When send operation fails
   - Then appropriate error response is returned

5. **Queue Integration**
   - Given successful send
   - When checking SQS console
   - Then message is visible in the queue

## Metadata
- **Complexity**: Low
- **Labels**: SQS, Messaging, Lambda, Queue Integration, Async Processing
- **Required Skills**: AWS SDK, SQS, Lambda, Message Queuing
