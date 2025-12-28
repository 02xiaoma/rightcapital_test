# Task: Parse Message Details and Format HTTP Requests

## Description
Implement message parsing logic to extract delivery details from SQS messages and format them into proper HTTP requests.

## Background
SQS messages contain serialized delivery information that must be parsed and transformed into executable HTTP requests. This parsing ensures that the external API receives requests in the correct format with all specified headers, method, and body content.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Parse JSON message body from SQS events
2. Extract targetUrl, method, headers, and body from message data
3. Validate message format and required fields
4. Format HTTP request with proper headers and body encoding
5. Handle different content types and body formats
6. Add message correlation IDs to request headers for tracing
7. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- HTTP client integration from previous task
- SQS message format defined in earlier steps
- Understanding of HTTP request formatting

## Implementation Approach
1. Update message parsing logic in worker handler
2. Implement JSON parsing with error handling
3. Create HTTP request formatting functions
4. Add header processing and content-type handling
5. Include correlation IDs for request tracing
6. Test parsing with various message formats

## Acceptance Criteria

1. **Message Parsing**
   - Given SQS message with delivery data
   - When parsing executes
   - Then targetUrl, method, headers, body are correctly extracted

2. **JSON Validation**
   - Given malformed JSON in message
   - When parsing fails
   - Then error is handled gracefully with logging

3. **HTTP Request Formatting**
   - Given parsed message data
   - When HTTP request is formatted
   - Then method, URL, headers, and body match specifications

4. **Header Processing**
   - Given custom headers in message
   - When request is built
   - Then all headers are included in HTTP request

5. **Correlation ID Addition**
   - Given messageId from SQS
   - When request is formatted
   - Then correlation ID is added to request headers

## Metadata
- **Complexity**: Low
- **Labels**: Message Parsing, HTTP Formatting, SQS, Request Building, JSON
- **Required Skills**: Node.js, JSON Parsing, HTTP Headers, Request Formatting
