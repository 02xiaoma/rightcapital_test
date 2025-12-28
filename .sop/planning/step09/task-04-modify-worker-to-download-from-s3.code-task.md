# Task: Modify Worker to Download from S3

## Description>
Update the worker Lambda to detect S3 URLs in messages and download payload content before HTTP delivery.

## Background>
When messages contain S3 presigned URLs instead of direct payloads, the worker must download the content from S3 before executing the HTTP request to the external API.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Detect S3 URLs in message payload field
2. Download content from S3 using presigned URLs
3. Replace URL with downloaded content for HTTP delivery
4. Handle S3 download failures gracefully
5. Add timeout and size limits for S3 downloads
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Worker HTTP delivery logic from Step 5
- S3 URL generation and message format from previous tasks
- AWS SDK S3 client for downloads

## Implementation Approach
1. Add S3 client to worker Lambda
2. Implement payload download logic for S3 URLs
3. Update message parsing to handle both payload types
4. Add download error handling and timeouts
5. Integrate S3 download with existing HTTP delivery
6. Test end-to-end flow with S3 payloads

## Acceptance Criteria

1. **URL Detection**
   - Given message with S3 URL
   - When worker processes
   - Then S3 URL is identified as payload source

2. **Content Download**
   - Given valid S3 URL
   - When download executes
   - Then payload content is retrieved from S3

3. **Payload Replacement**
   - Given downloaded content
   - When HTTP request builds
   - Then S3 content replaces URL in delivery

4. **Download Error Handling**
   - Given invalid S3 URL
   - When download fails
   - Then appropriate error handling occurs

5. **Performance Limits**
   - Given large S3 content
   - When download runs
   - Then size and timeout limits are enforced

## Metadata
- **Complexity**: Medium
- **Labels**: S3, Downloads, Worker, Payload Handling, HTTP Delivery
- **Required Skills**: AWS SDK, S3 Operations, HTTP Clients, Error Handling, Timeouts
