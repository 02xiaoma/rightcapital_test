# Task: Implement Error Response Formatting

## Description
Create structured error response formatting for validation failures and system errors, ensuring consistent API error handling across the notification system.

## Background
Clear and consistent error responses are essential for API usability. Clients need specific error codes and messages to understand what went wrong and how to fix their requests, improving the developer experience and reducing support burden.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Create error response utility functions for different error types
2. Implement specific error codes for validation failures (missing fields, invalid formats)
3. Add error codes for system errors (DynamoDB failures, internal errors)
4. Return appropriate HTTP status codes (400 for client errors, 500 for server errors)
5. Include correlation IDs in error responses for debugging
6. Format responses according to API Gateway Lambda proxy integration
7. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed validation and deduplication logic
- Understanding of API Gateway response format
- Error handling best practices

## Implementation Approach
1. Create error response builder functions
2. Define error code constants and messages
3. Update validation logic to use structured error responses
4. Add error handling for DynamoDB and other system failures
5. Include request correlation IDs in responses
6. Test error response formatting with various scenarios

## Acceptance Criteria

1. **Validation Error Format**
   - Given missing required field
   - When error response is generated
   - Then response includes 400 status, error code, and descriptive message

2. **System Error Format**
   - Given DynamoDB service failure
   - When error response is generated
   - Then response includes 500 status, generic error code, and safe message

3. **Correlation ID Inclusion**
   - Given any error response
   - When response is returned
   - Then correlation ID from request is included for debugging

4. **API Gateway Compatibility**
   - Given error response object
   - When returned from Lambda
   - Then format matches API Gateway proxy integration requirements

5. **Error Code Consistency**
   - Given same error type
   - When responses are generated
   - Then error codes and messages are consistent across requests

## Metadata
- **Complexity**: Low
- **Labels**: Error Handling, API, Lambda, Response Formatting
- **Required Skills**: Node.js, Lambda, API Gateway, Error Handling
