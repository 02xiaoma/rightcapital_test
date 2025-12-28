# Task: Implement Structured Logging with Correlation IDs

## Description>
Enhance logging across all Lambda functions with structured JSON format and correlation IDs for improved debugging and monitoring.

## Background>
Structured logging enables better log analysis, correlation of related events, and programmatic processing of logs. Correlation IDs allow tracing requests through the entire system from API acceptance to final delivery.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Update Lambda functions to use structured JSON logging
2. Implement correlation ID generation and propagation
3. Add request tracing from API through worker processing
4. Include relevant context in all log entries (messageId, operation, result)
5. Configure appropriate log levels (INFO, WARN, ERROR)
6. Use CDK to deploy updated Lambda functions with fake account ID (123456789012)

## Dependencies
- Lambda functions from previous steps
- Understanding of structured logging best practices
- Correlation ID generation logic

## Implementation Approach
1. Create structured logging utility functions
2. Implement correlation ID generation and passing
3. Update all Lambda handlers to use structured logging
4. Add context information to log entries
5. Test log parsing and correlation
6. Verify logs in CloudWatch with proper formatting

## Acceptance Criteria

1. **Structured JSON Logging**
   - Given Lambda function execution
   - When logging occurs
   - Then logs are in JSON format with consistent fields

2. **Correlation ID Generation**
   - Given API request
   - When processing starts
   - Then unique correlation ID is generated and logged

3. **ID Propagation**
   - Given correlation ID from API
   - When passed to worker
   - Then same ID appears in worker logs

4. **Context Information**
   - Given processing operation
   - When logging events
   - Then relevant context (messageId, operation type, result) is included

5. **CloudWatch Integration**
   - Given structured logs
   - When viewing in CloudWatch
   - Then logs are properly formatted and filterable

## Metadata
- **Complexity**: Low
- **Labels**: Logging, Correlation ID, Structured Logs, CloudWatch, Debugging
- **Required Skills**: Node.js Logging, JSON Formatting, Request Tracing, CloudWatch Logs
