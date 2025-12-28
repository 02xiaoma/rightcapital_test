# Task: Implement DynamoDB Deduplication Check

## Description
Add DynamoDB-based deduplication logic to the Lambda handler to ensure exactly-once processing semantics using the composite primary key.

## Background
Deduplication is critical for the exactly-once delivery guarantee. By checking if a message with the same composite key (messageId#senderId + timestamp#targetUrl) has been processed before, the system can return success for duplicate requests without reprocessing.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Implement DynamoDB query using composite key (messageId#senderId as partition key, timestamp#targetUrl as sort key)
2. Check if message already exists in table
3. Return success response immediately for duplicate messages (idempotency)
4. Continue processing for new messages
5. Handle DynamoDB connection and query errors gracefully
6. Use CDK to deploy with fake account ID (123456789012)

## Dependencies
- Completed request validation from previous task
- DynamoDB table from Step 1 infrastructure
- AWS SDK DynamoDB client
- Understanding of composite key design

## Implementation Approach
1. Import DynamoDB client into Lambda handler
2. Create function to build composite key from request data
3. Implement deduplication check query
4. Add conditional logic for duplicate vs new message handling
5. Handle DynamoDB errors and timeouts
6. Update Lambda function code and deploy via CDK

## Acceptance Criteria

1. **Composite Key Construction**
   - Given request with messageId, senderId, timestamp, targetUrl
   - When composite key is built
   - Then partition key is messageId#senderId and sort key is timestamp#targetUrl

2. **Duplicate Detection**
   - Given duplicate message request
   - When deduplication check runs
   - Then existing record is found and success returned

3. **New Message Processing**
   - Given new unique message
   - When deduplication check runs
   - Then no existing record found and processing continues

4. **DynamoDB Error Handling**
   - Given DynamoDB service error
   - When deduplication check fails
   - Then appropriate error response is returned

5. **Idempotent Behavior**
   - Given identical requests
   - When processed multiple times
   - Then all return same success response without side effects

## Metadata
- **Complexity**: Medium
- **Labels**: DynamoDB, Deduplication, Lambda, Idempotency, Composite Keys
- **Required Skills**: AWS SDK, DynamoDB, Lambda, Error Handling
