# Implementation Context: Implement Request Validation in Lambda

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, Node.js, API Gateway, JSON Validation
- **Current Infrastructure**: Complete Lambda function with API Gateway integration

## Requirements Analysis
The task requires updating the Lambda handler to implement comprehensive request validation for the notification API.

### Functional Requirements
- Parse JSON request body from API Gateway Lambda proxy event
- Validate required fields: messageId, timestamp, senderId, targetUrl
- Validate optional fields: method (defaults to POST), headers, body
- Implement type checking and format validation
- Return structured error responses for validation failures
- Use CDK deployment with fake account ID (123456789012)

### Non-Functional Requirements
- Clear and descriptive error messages for different validation failures
- Proper error response format consistent with API standards
- Efficient validation logic without unnecessary processing
- Maintainable code structure for future enhancements
- Comprehensive input validation to prevent system errors

### Acceptance Criteria
- JSON parsing works correctly for valid requests
- Missing required fields return 400 with specific error messages
- Invalid field formats return appropriate validation errors
- Valid requests pass validation and continue processing
- Error responses include proper HTTP status codes and messages

## Existing Documentation
**Design Document**: design/detailed-design.md contains API specification

**Previous Implementation**: Basic Lambda handler returning static 200 OK response

## Dependencies & Technology Stack
- **AWS Lambda**: Node.js 18.x runtime with API Gateway integration
- **Infrastructure Stack**: Existing Lambda function construct to modify
- **API Gateway**: Lambda proxy integration providing request body
- **Validation Logic**: Custom validation functions for request fields

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (update Lambda code)
- **Test Location**: infrastructure/test/ directory (add validation tests)
- **Integration**: Modify existing Lambda function inline code

## Patterns & Best Practices
- **Input Validation**: Validate all inputs before processing
- **Error Handling**: Consistent error response format
- **Type Checking**: Validate data types and formats
- **Security**: Prevent malformed requests from causing issues
- **Logging**: Log validation failures for monitoring

## Key Design Decisions
- **Validation Strategy**: Separate validation functions for each field type
- **Error Format**: Structured JSON error responses with error codes
- **Field Requirements**: messageId, timestamp, senderId, targetUrl are required
- **Optional Fields**: method defaults to POST, headers and body are optional
- **Format Validation**: Basic format checks for URLs, timestamps, etc.

## Risks & Considerations
- Overly strict validation could reject valid requests
- Under-validation could allow malformed data into the system
- Error messages should not leak sensitive information
- Validation logic should be maintainable as requirements evolve
- Performance impact of validation on request processing

## Summary
This task transforms the basic Lambda handler into a robust request validation system, ensuring only properly formatted notification requests are accepted and processed by the system.
