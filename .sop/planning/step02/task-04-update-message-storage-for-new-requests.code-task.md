# Task: Update Message Storage for New Requests

## Description
Implement message metadata storage in DynamoDB for new validated requests, establishing the foundation for status tracking and exactly-once processing.

## Background
For new messages that pass validation and deduplication checks, storing metadata in DynamoDB enables the system to track processing status, retry attempts, and delivery results throughout the message lifecycle.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Store message metadata in DynamoDB for new requests after validation
2. Set initial status to "PENDING" for new messages
3. Include all required fields: messageId, senderId, timestamp, targetUrl, status, attempts
4. Generate TTL timestamp for automatic cleanup
5. Handle DynamoDB put operation errors gracefully
6. Return success response after successful storage
7. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed validation, deduplication, and error handling
- DynamoDB table from Step 1 infrastructure
- AWS SDK DynamoDB put operation
- Understanding of message metadata schema

## Implementation Approach
1. Create message metadata object from validated request data
2. Implement DynamoDB put operation for new messages
3. Add error handling for storage failures
4. Update success response logic for stored messages
5. Test storage operation with various scenarios
6. Deploy updated function via CDK

## Acceptance Criteria

1. **Metadata Storage**
   - Given validated new message
   - When storage operation completes
   - Then message metadata is stored in DynamoDB with PENDING status

2. **Required Fields Storage**
   - Given message request
   - When stored in DynamoDB
   - Then all required fields (messageId, senderId, timestamp, targetUrl) are preserved

3. **Status Initialization**
   - Given new message storage
   - When record is created
   - Then status is set to PENDING and attempts to 0

4. **TTL Configuration**
   - Given message storage
   - When record is created
   - Then TTL field is set for automatic expiration

5. **Storage Error Handling**
   - Given DynamoDB put failure
   - When storage operation fails
   - Then appropriate error response is returned to client

## Metadata
- **Complexity**: Low
- **Labels**: DynamoDB, Storage, Lambda, Message Metadata, Status Tracking
- **Required Skills**: AWS SDK, DynamoDB, Lambda, Data Persistence
