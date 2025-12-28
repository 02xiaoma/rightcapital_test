# Implementation Plan: Update Message Storage for New Requests

## Test Strategy

### Test Scenarios
Tests focus on message metadata storage operations and data persistence in DynamoDB.

1. **Metadata Storage Test**
   - Verify message metadata is stored after validation and deduplication pass
   - Confirm all required fields are properly stored with correct data types
   - Validate composite key construction and usage

2. **Status Initialization Test**
   - Verify new messages are stored with "PENDING" status
   - Confirm attempts counter is initialized to 0
   - Test status field data type and constraints

3. **TTL Configuration Test**
   - Verify TTL field is set for automatic expiration
   - Test TTL timestamp calculation and format
   - Confirm TTL enables automatic cleanup

4. **Storage Error Handling Test**
   - Mock DynamoDB put operation failures
   - Verify appropriate SYSTEM_ERROR responses for storage failures
   - Test graceful error handling without exposing internal details

5. **Data Consistency Test**
   - Verify stored data matches input request fields exactly
   - Test field mapping and data transformation logic
   - Confirm no data loss or corruption during storage

6. **Integration Test**
   - Test complete flow: validation → deduplication → storage → success response
   - Verify storage occurs only for new, valid, non-duplicate messages
   - Confirm success response includes stored message confirmation

### Testing Approach
- Unit tests for storage logic and data transformation
- Integration tests with mocked DynamoDB operations
- Mock API Gateway events with valid message data
- Test error scenarios with DynamoDB service failures
- Validate success responses and error handling

## Implementation Strategy

### High-Level Architecture
- Add message metadata storage logic after deduplication check passes
- Create structured metadata object from validated request data
- Implement DynamoDB put operation with error handling
- Set appropriate TTL for automatic cleanup
- Return success response with storage confirmation

### Key Implementation Tasks
1. Create message metadata object builder function
2. Implement DynamoDB put operation for new messages
3. Add TTL timestamp calculation and configuration
4. Handle storage operation errors gracefully
5. Update success response to include storage confirmation
6. Test storage operation with various scenarios
7. Deploy updated Lambda function via CDK

### Dependencies
- **Existing Lambda Handler**: Validation and deduplication logic
- **DynamoDB Table**: Existing table with composite key structure
- **AWS SDK**: DynamoDB put operation for metadata storage
- **TTL Configuration**: Environment variable for retention period
- **Error Handling**: Existing error response formatting

## Risk Assessment
- **Storage Failures**: DynamoDB errors could block message processing
- **Data Inconsistency**: Incorrect field mapping or data types
- **TTL Misconfiguration**: Premature data loss or excessive retention
- **Performance Impact**: Storage operations adding latency
- **Cost Implications**: Additional DynamoDB write operations

## Success Criteria
- Message metadata is stored in DynamoDB for validated, non-duplicate requests
- Required fields (messageId, senderId, timestamp, targetUrl) are properly stored
- Status is initialized to "PENDING" and attempts to 0
- TTL field is set for automatic expiration
- Storage errors are handled gracefully with SYSTEM_ERROR responses
- Success response is returned after successful storage
