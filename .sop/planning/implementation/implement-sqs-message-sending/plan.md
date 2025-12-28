# Implementation Plan: Implement SQS Message Sending

## Test Strategy

### Test Scenarios
Tests focus on SQS message sending operations and queue integration.

1. **Message Sending Test**
   - Verify message is sent to SQS queue after successful storage
   - Confirm message appears in queue with correct payload
   - Validate SQS sendMessage operation completes successfully

2. **Message Content Test**
   - Verify all required fields included in queue message (targetUrl, method, headers, body)
   - Test optional field inclusion when provided in request
   - Confirm message payload structure matches consumer expectations

3. **Message Attributes Test**
   - Verify messageId set as message attribute for tracing
   - Confirm correlationId included for end-to-end tracking
   - Test attribute data types and values

4. **Send Error Handling Test**
   - Mock SQS service failures and throttling
   - Verify appropriate SYSTEM_ERROR responses for send failures
   - Test graceful error handling without exposing internal details

5. **Integration Test**
   - Test complete flow: validation → deduplication → storage → queuing → success response
   - Verify queuing occurs only for successfully stored messages
   - Confirm success response includes queuing confirmation

### Testing Approach
- Unit tests for SQS message formatting and sending logic
- Integration tests with mocked SQS operations
- Mock API Gateway events with valid message data
- Test error scenarios with SQS service failures
- Validate message format and attribute structure

## Implementation Strategy

### High-Level Architecture
- Add SQS message sending logic after successful DynamoDB storage
- Create structured message payload from validated request data
- Implement SQS sendMessage operation with message attributes
- Handle send operation errors gracefully
- Return success response with queuing confirmation

### Key Implementation Tasks
1. Import SQS client into Lambda handler
2. Create queue message payload from request data
3. Set message attributes for metadata and tracing
4. Implement SQS sendMessage operation
5. Add error handling for send failures
6. Update success response to include queuing confirmation
7. Test message sending with various scenarios
8. Deploy updated Lambda function via CDK

### Dependencies
- **Existing Lambda Handler**: Validation, deduplication, and storage logic
- **SQS Queue**: Existing queue from Step 1 infrastructure
- **AWS SDK**: SQS sendMessage operation for message queuing
- **Message Format**: Structured payload for consumer processing
- **Error Handling**: Existing error response formatting

## Risk Assessment
- **SQS Send Failures**: Queue operations could block message acceptance
- **Message Size Limits**: Large payloads could exceed SQS limits
- **Queue Throttling**: High throughput could trigger throttling
- **Message Ordering**: Potential ordering issues for certain use cases
- **Cost Impact**: Additional SQS operations increase costs
- **Consumer Compatibility**: Message format changes could break consumers

## Success Criteria
- Message details sent to SQS queue after successful DynamoDB storage
- All necessary message data included in queue message payload
- Message attributes contain messageId and correlation ID
- SQS send operation errors handled with SYSTEM_ERROR responses
- Success response returned after successful message queuing
