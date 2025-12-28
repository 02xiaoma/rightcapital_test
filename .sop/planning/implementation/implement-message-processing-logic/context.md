# Implementation Context: Implement Message Processing Logic

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, SQS, DynamoDB, Node.js, Event-Driven Architecture
- **Current Infrastructure**: Complete worker Lambda with SQS event source mapping ready for message processing

## Requirements Analysis
The task requires implementing the core message processing logic in the worker Lambda to handle SQS messages, log contents, and update DynamoDB status. This is the heart of the worker function that receives SQS messages, extracts delivery information, logs processing details, and updates message status to reflect active processing.

### Functional Requirements
- Implement SQS event handler to process message batches from event source mapping
- Parse message body and extract delivery information (target URL, method, headers, body)
- Log message details with correlation IDs for debugging and operational monitoring
- Update DynamoDB message status from QUEUED to PROCESSING with atomic operations
- Handle batch processing with individual message tracking and error isolation
- Add structured logging with relevant metadata (correlation IDs, timestamps, processing metrics)
- Maintain message visibility and processing state consistency

### Non-Functional Requirements
- Efficient message parsing and validation from SQS event format
- Comprehensive logging for operational debugging and monitoring
- Atomic status updates preventing race conditions and data inconsistency
- Error handling for malformed messages and processing failures
- Performance optimization for high-throughput batch processing
- Correlation ID tracking for end-to-end request tracing

### Acceptance Criteria
- SQS event handler correctly processes event structure with message batches
- Message body parsing extracts delivery information (URL, method, headers, body)
- DynamoDB status updates correctly transition from QUEUED to PROCESSING
- Structured logs contain correlation IDs and key processing information
- Batch processing handles multiple messages appropriately with error isolation

## Existing Documentation
**Design Document**: design/detailed-design.md contains message processing logic specifications

**Current Implementation**: Worker Lambda with event source mapping and basic processing framework

## Dependencies & Technology Stack
- **Worker Lambda Function**: From previous task with SQS event source mapping
- **DynamoDB Table**: Message storage with status tracking capabilities
- **SQS Message Format**: Structured message format from API handler
- **Event Processing**: SQS Lambda event format and batch processing
- **Logging Framework**: Structured logging with correlation ID support
- **Error Handling**: Graceful error handling for processing failures

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (update worker Lambda inline code)
- **Test Location**: infrastructure/test/ directory (add message processing tests)
- **Integration**: Update worker function to process messages and update status

## Patterns & Best Practices
- **SQS Event Processing**: Proper handling of SQS event format and message attributes
- **Message Parsing**: Robust JSON parsing with error handling for malformed messages
- **Status Updates**: Atomic DynamoDB updates with conditional expressions
- **Correlation Logging**: Consistent correlation ID propagation through logs
- **Batch Processing**: Individual message processing with error isolation
- **Error Handling**: Graceful failure handling without stopping batch processing

## Key Design Decisions
- **Status Transition**: QUEUED → PROCESSING to indicate active message processing
- **Message Parsing**: Robust JSON parsing with fallback error handling
- **Logging Strategy**: Structured logging with correlation IDs and processing metrics
- **Batch Handling**: Individual message processing with per-message error tracking
- **Atomic Updates**: Conditional DynamoDB updates preventing concurrent modification issues
- **Error Isolation**: Single message failures don't affect batch processing

## Risks & Considerations
- **Message Format Changes**: SQS message format must remain consistent with API handler
- **Status Update Conflicts**: Concurrent processing could cause status update conflicts
- **Parsing Errors**: Malformed JSON messages could cause processing failures
- **Logging Overhead**: Excessive logging could impact performance and costs
- **Batch Size Impact**: Large batches could cause timeout issues during processing
- **Visibility Timeout**: Processing time must stay within SQS visibility timeout

## Summary
This task implements the core message processing logic that transforms the worker Lambda from a basic event receiver into a fully functional message processor, handling SQS events, logging processing details, and updating message status for active processing.
