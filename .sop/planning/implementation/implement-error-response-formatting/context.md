# Implementation Context: Implement Error Response Formatting

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, Node.js, API Gateway, Error Handling
- **Current Infrastructure**: Complete Lambda function with validation and deduplication

## Requirements Analysis
The task requires implementing structured error response formatting to provide consistent and informative error responses across the notification API.

### Functional Requirements
- Create error response utility functions for different error types
- Implement specific error codes for validation failures (missing fields, invalid formats)
- Add error codes for system errors (DynamoDB failures, internal errors)
- Return appropriate HTTP status codes (400 for client errors, 500 for server errors)
- Include correlation IDs in error responses for debugging
- Format responses according to API Gateway Lambda proxy integration

### Non-Functional Requirements
- Consistent error response format across all error scenarios
- Developer-friendly error messages with actionable information
- Security-conscious error messages that don't leak sensitive information
- Proper HTTP status code usage following REST API standards
- Correlation IDs for request tracing and debugging
- Maintainable error code system for future enhancements

### Acceptance Criteria
- Validation errors return 400 with specific error codes and messages
- System errors return 500 with generic error codes and safe messages
- All error responses include correlation IDs for debugging
- Response format matches API Gateway proxy integration requirements
- Error codes and messages are consistent across identical error types

## Existing Documentation
**Design Document**: design/detailed-design.md contains error handling specifications

**Previous Implementation**: Basic error response function exists in Lambda handler

## Dependencies & Technology Stack
- **Current Lambda Handler**: Existing validation and deduplication logic
- **API Gateway Integration**: Lambda proxy response format requirements
- **Error Classification**: Understanding of client vs server error types
- **Correlation IDs**: Request tracing functionality

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (enhance Lambda code)
- **Test Location**: infrastructure/test/ directory (add error formatting tests)
- **Integration**: Update existing error response function and usage

## Patterns & Best Practices
- **Error Code Standards**: Consistent error code naming and categorization
- **HTTP Status Codes**: Proper use of 4xx vs 5xx status codes
- **Message Security**: Avoid exposing internal system details
- **Developer Experience**: Provide clear, actionable error messages
- **Debugging Support**: Include correlation IDs and request context

## Key Design Decisions
- **Error Code System**: Categorized error codes (VALIDATION_ERROR, SYSTEM_ERROR, etc.)
- **Response Structure**: Consistent JSON format with error, message, timestamp, requestId
- **Status Code Mapping**: 400 for validation errors, 500 for system errors
- **Correlation Integration**: Include request IDs from API Gateway events
- **Message Standardization**: Clear, concise error messages for common scenarios

## Risks & Considerations
- Information leakage through error messages
- Inconsistent error codes across different error paths
- Missing correlation IDs in some error scenarios
- Performance impact of detailed error responses
- Backward compatibility with existing error responses
- Developer confusion from unclear error messages

## Summary
This task enhances error handling to provide structured, consistent, and developer-friendly error responses that improve API usability and debugging capabilities.
