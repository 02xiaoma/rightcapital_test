# Implementation Context: Parse Message Details and Format HTTP Requests

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, Node.js, SQS Message Processing, HTTP Request Formatting
- **Current Infrastructure**: HTTP client integrated, ready for enhanced message parsing

## Requirements Analysis
This task focuses on implementing robust message parsing logic to extract delivery details from SQS messages and format them into proper HTTP requests. While basic parsing was implemented in the previous task, this task emphasizes comprehensive validation, error handling, and proper request formatting.

### Functional Requirements
- Parse JSON message body from SQS events with comprehensive error handling
- Extract and validate targetUrl, method, headers, and body from message data
- Implement strict message format validation and required field checking
- Format HTTP requests with proper headers, content-type handling, and body encoding
- Handle various content types and body formats (JSON, form data, etc.)
- Add message correlation IDs and tracing headers to requests
- Implement graceful error handling for malformed messages

### Non-Functional Requirements
- Robust JSON parsing with detailed error messages
- Comprehensive message validation with field-level error reporting
- Proper HTTP header processing and content-type detection
- Efficient message parsing without performance impact
- Detailed logging for debugging message parsing issues
- Maintainable code structure for future message format changes

### Acceptance Criteria
- SQS messages with delivery data are correctly parsed to extract all required fields
- Malformed JSON in messages triggers graceful error handling with appropriate logging
- Parsed message data is properly formatted into HTTP requests with correct method, URL, headers, and body
- Custom headers from messages are included in HTTP requests
- Correlation IDs are automatically added to request headers for end-to-end tracing

## Existing Documentation
**Design Document**: design/detailed-design.md contains message format specifications

**Previous Implementation**: Basic HTTP client integration and request execution from Step 05 Task 01

## Dependencies & Technology Stack
- **Worker Lambda Function**: From previous tasks with basic message processing
- **SQS Message Format**: Structured messages with targetUrl, method, headers, body fields
- **HTTP Client**: Axios library for request formatting and execution
- **JSON Parsing**: Node.js built-in JSON parsing with error handling
- **Validation Logic**: Custom validation for message format compliance

## Implementation Paths
- **Enhanced Message Parsing**: More robust JSON parsing with detailed error reporting
- **Comprehensive Validation**: Strict validation of all message fields and formats
- **Advanced Request Formatting**: Sophisticated HTTP request building with content-type handling
- **Header Processing**: Advanced header merging and conflict resolution
- **Correlation ID Management**: Systematic addition of tracing headers
- **Error Handling**: Comprehensive error categorization and reporting

## Patterns & Best Practices
- **Defensive Parsing**: Always expect and handle malformed input gracefully
- **Validation First**: Validate message format before attempting to use data
- **Header Safety**: Prevent header injection and ensure safe header processing
- **Content-Type Detection**: Automatically detect and set appropriate content types
- **Correlation Tracing**: Ensure every request has proper correlation IDs
- **Error Logging**: Detailed error logging without exposing sensitive information

## Key Design Decisions
- **Strict Validation**: Reject messages with missing or invalid required fields
- **Comprehensive Error Handling**: Categorize parsing errors for different remediation actions
- **Header Sanitization**: Clean and validate custom headers before inclusion
- **Content-Type Intelligence**: Auto-detect content type based on body format
- **Correlation ID Priority**: System-generated correlation IDs take precedence over user-provided ones
- **Logging Strategy**: Structured logging for parsing success and failure scenarios

## Risks & Considerations
- **Message Format Changes**: Future message format changes require parser updates
- **Header Injection**: Malicious headers could cause security issues
- **Large Message Bodies**: Very large message bodies could impact Lambda memory
- **Encoding Issues**: Different character encodings in message bodies
- **Header Conflicts**: User headers conflicting with system headers
- **Performance Impact**: Complex parsing logic could slow message processing

## Summary
This task builds upon the basic HTTP client integration by implementing sophisticated message parsing and HTTP request formatting. The focus is on robust validation, comprehensive error handling, and proper request construction to ensure reliable delivery to external APIs. The implementation transforms raw SQS messages into well-formed HTTP requests with proper headers, content types, and tracing information.
