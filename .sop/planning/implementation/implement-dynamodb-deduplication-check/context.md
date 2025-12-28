# Implementation Context: Implement DynamoDB Deduplication Check

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, DynamoDB, Node.js, AWS SDK
- **Current Infrastructure**: Complete Lambda function with request validation

## Requirements Analysis
The task requires implementing DynamoDB-based deduplication to ensure exactly-once processing semantics for notification requests.

### Functional Requirements
- Implement DynamoDB query using composite key (messageId#senderId as partition key, timestamp#targetUrl as sort key)
- Check if message already exists in the table
- Return success response immediately for duplicate messages (idempotency)
- Continue processing for new messages
- Handle DynamoDB connection and query errors gracefully
- Use CDK deployment with fake account ID (123456789012)

### Non-Functional Requirements
- Exactly-once delivery guarantee for duplicate requests
- Efficient deduplication check without unnecessary database operations
- Proper error handling for DynamoDB failures
- Idempotent behavior for identical requests
- Performance optimization for high-throughput scenarios
- Maintainable code structure for future enhancements

### Acceptance Criteria
- Composite key correctly constructed from request data
- Duplicate messages detected and handled with success response
- New messages proceed to next processing stage
- DynamoDB errors handled gracefully with appropriate responses
- Idempotent behavior maintained across multiple identical requests

## Existing Documentation
**Design Document**: design/detailed-design.md contains deduplication specifications

**Previous Implementation**: Request validation logic in Lambda function

## Dependencies & Technology Stack
- **AWS SDK**: DynamoDB client for Lambda handler
- **Infrastructure Stack**: Existing DynamoDB table construct from Step 1
- **Lambda Function**: Current function with validation logic to extend
- **Composite Key Design**: Understanding of partition/sort key structure

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (extend Lambda code)
- **Test Location**: infrastructure/test/ directory (add deduplication tests)
- **Integration**: Modify existing Lambda function inline code

## Patterns & Best Practices
- **Composite Key Usage**: Proper construction and querying of composite keys
- **Idempotency**: Ensuring identical requests return identical responses
- **Error Handling**: Graceful degradation when DynamoDB is unavailable
- **Performance**: Efficient queries and minimal database operations
- **Logging**: Comprehensive logging of deduplication results

## Key Design Decisions
- **Query Strategy**: Use GetItem for exact composite key matching
- **Error Handling**: Return success for duplicate detection, error for service failures
- **Idempotency Logic**: Duplicate messages return same success response
- **Performance**: Single query per request with minimal data transfer
- **Fallback**: Continue processing if deduplication check fails

## Risks & Considerations
- DynamoDB throttling could impact performance
- Network timeouts during deduplication checks
- Composite key collisions (extremely unlikely with proper data)
- Database unavailability affecting new message processing
- Cost implications of frequent DynamoDB queries
- Race conditions in high-concurrency scenarios

## Summary
This task implements the critical deduplication logic that ensures exactly-once delivery semantics, preventing duplicate message processing while maintaining system reliability and performance.
