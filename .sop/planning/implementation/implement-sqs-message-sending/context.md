# Implementation Context: Implement SQS Message Sending

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, SQS, Node.js, Message Queuing
- **Current Infrastructure**: Complete Lambda function with validation, deduplication, storage, and error handling

## Requirements Analysis
The task requires implementing SQS message sending functionality to queue validated and stored messages for asynchronous processing, completing the API request to async processing pipeline.

### Functional Requirements
- Send message details to SQS queue after successful DynamoDB storage
- Include all necessary message data in queue message (targetUrl, method, headers, body, etc.)
- Use message attributes for metadata like messageId and correlation ID
- Handle SQS send operation errors gracefully
- Return success response after successful message sending

### Non-Functional Requirements
- Reliable message queuing for async processing decoupling
- Proper message formatting for downstream consumer processing
- Efficient SQS operations with minimal latency impact
- Comprehensive error handling for queuing failures
- Message traceability through correlation IDs and attributes
- Scalable queuing solution for high-throughput scenarios

### Acceptance Criteria
- Message appears in SQS queue after successful storage operation
- All required fields (targetUrl, method, headers, body) included in queue message
- Message attributes contain messageId and correlation ID for tracing
- Send operation errors handled with appropriate SYSTEM_ERROR responses
- Success response returned after successful message queuing

## Existing Documentation
**Design Document**: design/detailed-design.md contains message queuing specifications

**Previous Implementation**: Lambda handler with validation, deduplication, storage, and error handling

## Dependencies & Technology Stack
- **Current Lambda Handler**: Existing validation, deduplication, and storage logic
- **SQS Queue**: Existing queue from Step 1 infrastructure
- **AWS SDK**: SQS sendMessage operation for message queuing
- **Message Format**: Structured message payload for consumer processing
- **Error Handling**: Existing error response formatting

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (extend Lambda code)
- **Test Location**: infrastructure/test/ directory (add SQS sending tests)
- **Integration**: Add SQS sending logic after successful storage

## Patterns & Best Practices
- **Message Payload**: Structured JSON payload for consumer processing
- **Message Attributes**: Metadata for filtering, tracing, and monitoring
- **Error Recovery**: Graceful handling of SQS service failures
- **Correlation Tracking**: Request IDs for end-to-end message tracing
- **Queue Management**: Proper message ordering and visibility
- **Performance Optimization**: Efficient SQS operations

## Key Design Decisions
- **Message Payload**: Include all request data (targetUrl, method, headers, body)
- **Message Attributes**: messageId and correlationId for metadata and tracing
- **Error Handling**: SYSTEM_ERROR for SQS send failures with safe messages
- **Success Response**: Confirmation of both storage and queuing success
- **Queue URL**: Environment variable configuration for queue reference
- **Message Structure**: JSON payload with consistent field naming

## Risks & Considerations
- SQS send failures could block message acceptance
- Message size limits could cause queuing issues
- Queue throttling could impact API responsiveness
- Message ordering requirements for certain use cases
- Cost implications of SQS message operations
- Consumer processing failures and dead letter queues

## Summary
This task completes the API request to async processing pipeline by implementing reliable message queuing, enabling decoupling of request acceptance from message delivery for high-throughput, scalable notification processing.
