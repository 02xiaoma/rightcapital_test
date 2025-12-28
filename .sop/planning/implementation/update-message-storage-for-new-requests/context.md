# Implementation Context: Update Message Storage for New Requests

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda, DynamoDB, Node.js, Message Processing
- **Current Infrastructure**: Complete Lambda function with validation, deduplication, and error handling

## Requirements Analysis
The task requires implementing message metadata storage in DynamoDB for new validated requests, establishing the foundation for status tracking and exactly-once processing.

### Functional Requirements
- Store message metadata in DynamoDB for new requests after validation and deduplication
- Set initial status to "PENDING" for new messages
- Include all required fields: messageId, senderId, timestamp, targetUrl, status, attempts
- Generate TTL timestamp for automatic cleanup
- Handle DynamoDB put operation errors gracefully
- Return success response after successful storage

### Non-Functional Requirements
- Atomic storage operations for data consistency
- Efficient metadata storage without unnecessary data duplication
- Proper error handling for storage failures
- TTL-based automatic cleanup to prevent table bloat
- Foundation for future retry and status tracking logic
- Minimal performance impact on request processing

### Acceptance Criteria
- Metadata storage occurs after validation and deduplication pass
- Required fields are properly stored with correct data types
- Status is initialized to "PENDING" and attempts to 0
- TTL field is set for automatic expiration
- Storage errors are handled gracefully with appropriate responses
- Success response is returned after successful storage

## Existing Documentation
**Design Document**: design/detailed-design.md contains message storage specifications

**Previous Implementation**: Lambda handler with validation, deduplication, and error handling

## Dependencies & Technology Stack
- **Current Lambda Handler**: Existing validation and deduplication logic
- **DynamoDB Table**: Existing table from Step 1 with composite key structure
- **AWS SDK**: DynamoDB put operation for metadata storage
- **TTL Configuration**: Automatic cleanup for old message records
- **Error Handling**: Existing error response formatting

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (extend Lambda code)
- **Test Location**: infrastructure/test/ directory (add storage tests)
- **Integration**: Add storage logic after deduplication check passes

## Patterns & Best Practices
- **Metadata Schema**: Consistent field naming and data types
- **Status Lifecycle**: Standardized status values for tracking
- **TTL Strategy**: Automatic cleanup based on message age
- **Error Recovery**: Graceful handling of storage failures
- **Performance Optimization**: Efficient storage operations
- **Data Integrity**: Atomic operations for consistency

## Key Design Decisions
- **Storage Timing**: Store metadata after validation and deduplication pass
- **Status Initialization**: Start with "PENDING" status and 0 attempts
- **TTL Calculation**: Set expiration based on configurable retention period
- **Error Handling**: Return storage errors as SYSTEM_ERROR with safe messages
- **Field Mapping**: Direct mapping of request fields to storage attributes
- **Composite Key Usage**: Utilize existing partition/sort key structure

## Risks & Considerations
- Storage operation failures could block message processing
- TTL configuration could lead to premature data loss
- Schema changes could break future processing logic
- Performance impact from storage operations
- Data consistency issues during concurrent operations
- Cost implications of storing metadata for all messages

## Summary
This task establishes the message metadata storage foundation, enabling status tracking, retry logic, and exactly-once processing guarantees for the notification system.
