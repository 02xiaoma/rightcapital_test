# Task: Configure SQS Event Source

## Description
Set up SQS event source mapping to automatically trigger the worker Lambda when messages arrive in the queue.

## Background
Event source mapping connects the SQS queue to the worker Lambda, enabling automatic processing of queued messages. This creates the event-driven pipeline where messages are processed asynchronously without manual polling.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Create event source mapping between SQS queue and worker Lambda
2. Configure batch size for optimal processing (1-10 messages per batch)
3. Set maximum concurrency to prevent overwhelming downstream services
4. Configure maximum batching window for latency control
5. Enable partial batch responses for error handling
6. Use CDK to deploy event source mapping with fake account ID (123456789012)

## Dependencies
- Worker Lambda construct from previous task
- SQS queue from Step 1 infrastructure
- Understanding of Lambda event source mappings

## Implementation Approach
1. Import Lambda event source constructs
2. Create SQS event source mapping for worker function
3. Configure batch processing parameters
4. Set up concurrency and error handling settings
5. Test event source triggering with sample messages
6. Monitor Lambda invocation patterns

## Acceptance Criteria

1. **Event Source Mapping**
   - Given CDK configuration
   - When synthesized
   - Then CloudFormation contains SQS event source mapping

2. **Batch Configuration**
   - Given event source settings
   - When checking properties
   - Then batch size is configured for optimal processing

3. **Concurrency Control**
   - Given mapping configuration
   - When deployed
   - Then maximum concurrency prevents resource exhaustion

4. **Message Triggering**
   - Given message in SQS queue
   - When event source mapping is active
   - Then worker Lambda is automatically invoked

5. **Error Handling**
   - Given partial batch failures
   - When processing errors occur
   - Then failed messages are retried appropriately

## Metadata
- **Complexity**: Low
- **Labels**: SQS, Lambda, Event Source, Async Processing, Batch Processing
- **Required Skills**: AWS CDK, Lambda Event Sources, SQS Integration
