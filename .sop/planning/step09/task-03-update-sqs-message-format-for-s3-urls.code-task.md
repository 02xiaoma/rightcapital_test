# Task: Update SQS Message Format for S3 URLs

## Description>
Modify the SQS message sending logic to accommodate S3 presigned URLs in place of large payloads.

## Background>
When payloads are stored in S3, the SQS message must contain the presigned URL instead of the original payload. The worker will then download the content from S3 when processing the message.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Detect when payload has been replaced with S3 URL
2. Update SQS message structure to include S3 URL field
3. Maintain backward compatibility with direct payloads
4. Add metadata indicating payload location (S3 vs inline)
5. Ensure message size stays within SQS limits
6. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- SQS message sending from Step 3
- S3 URL generation from previous task
- Message format consistency across components

## Implementation Approach
1. Update message building logic to handle S3 URLs
2. Modify SQS message payload structure
3. Add payload location indicators
4. Maintain compatibility with existing message processing
5. Test message format with both payload types
6. Validate SQS message size constraints

## Acceptance Criteria

1. **URL Detection**
   - Given S3 URL in request
   - When message building runs
   - Then URL is correctly identified as payload location

2. **Message Structure**
   - Given S3 payload request
   - When SQS message is created
   - Then message contains S3 URL and location metadata

3. **Backward Compatibility**
   - Given direct payload request
   - When message is built
   - Then original message format is preserved

4. **Size Compliance**
   - Given S3 URL message
   - When sent to SQS
   - Then message size stays within SQS limits

5. **Metadata Inclusion**
   - Given payload location change
   - When message is formatted
   - Then appropriate metadata indicates storage method

## Metadata
- **Complexity**: Low
- **Labels**: SQS, Message Format, S3 URLs, Payload Handling, Compatibility
- **Required Skills**: Message Formatting, Conditional Logic, SQS Constraints, Data Structures
