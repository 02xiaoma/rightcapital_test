# Task: Implement Message Processing Logic

## Description
Develop the core message processing logic in the worker Lambda to handle SQS messages, log contents, and update DynamoDB status.

## Background
The message processing logic is the heart of the worker function. It receives SQS messages, extracts the delivery information, logs the processing, and updates the message status to reflect active processing.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Implement SQS event handler to process message batches
2. Parse message body and extract delivery information
3. Log message details with correlation IDs for debugging
4. Update DynamoDB message status to "PROCESSING"
5. Handle batch processing with individual message tracking
6. Add structured logging with relevant metadata
7. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Worker Lambda construct and event source from previous tasks
- DynamoDB table and SQS queue from Step 1
- Understanding of SQS Lambda event format

## Implementation Approach
1. Update worker Lambda handler to process SQS events
2. Extract message attributes and body content
3. Implement status update to PROCESSING in DynamoDB
4. Add comprehensive logging for monitoring
5. Handle batch processing and partial failures
6. Test message processing with sample data

## Acceptance Criteria

1. **Event Handler Implementation**
   - Given SQS event
   - When worker Lambda is invoked
   - Then handler correctly processes the event structure

2. **Message Parsing**
   - Given SQS message body
   - When processing logic runs
   - Then delivery information is correctly extracted

3. **Status Update**
   - Given message processing
   - When status update executes
   - Then DynamoDB record shows PROCESSING status

4. **Logging Output**
   - Given message processing
   - When logs are examined
   - Then structured logs contain correlation IDs and key information

5. **Batch Processing**
   - Given multiple messages in batch
   - When processing completes
   - Then all messages are handled appropriately

## Metadata
- **Complexity**: Medium
- **Labels**: Lambda, SQS, DynamoDB, Message Processing, Logging
- **Required Skills**: AWS SDK, Lambda Handlers, Event Processing, Logging
