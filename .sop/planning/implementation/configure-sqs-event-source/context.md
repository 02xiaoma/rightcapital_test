# Implementation Context: Configure SQS Event Source

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS Lambda Event Sources, SQS Integration, CDK
- **Current Infrastructure**: Complete worker Lambda and optimized SQS queue ready for event-driven processing

## Requirements Analysis
The task requires setting up SQS event source mapping to automatically trigger the worker Lambda when messages arrive in the queue. This creates the event-driven pipeline where messages are processed asynchronously without manual polling, forming the backbone of the message processing workflow.

### Functional Requirements
- Create event source mapping between SQS queue and worker Lambda for automatic message processing
- Configure batch size (1-10 messages) for optimal processing efficiency and throughput
- Set maximum concurrency to prevent overwhelming downstream services and external APIs
- Configure maximum batching window for latency control and timely processing
- Enable partial batch responses for fine-grained error handling and retry logic
- Deploy event source mapping using CDK with fake account ID (123456789012)

### Non-Functional Requirements
- Optimized batch processing for high-throughput message handling
- Controlled concurrency to prevent resource exhaustion and API rate limiting
- Efficient latency management through batching window configuration
- Robust error handling with partial batch failure support
- Scalable event-driven architecture for production workloads
- Monitoring-friendly event source configuration

### Acceptance Criteria
- CDK construct creates CloudFormation for SQS event source mapping
- Batch size configured for optimal processing efficiency
- Maximum concurrency prevents resource exhaustion during peak loads
- Messages in SQS queue automatically trigger worker Lambda invocation
- Partial batch failures handled appropriately with retry mechanisms

## Existing Documentation
**Design Document**: design/detailed-design.md contains event source mapping specifications

**Current Implementation**: Worker Lambda construct and optimized SQS queue ready for integration

## Dependencies & Technology Stack
- **Worker Lambda Function**: From previous task with proper IAM permissions and configuration
- **SQS Queue**: Optimized queue with proper visibility timeout and throughput settings
- **CDK Event Sources**: AWS CDK Lambda event source mapping constructs
- **Event-Driven Architecture**: Understanding of Lambda triggers and batch processing
- **Concurrency Management**: AWS Lambda concurrency limits and scaling behavior
- **Error Handling**: Partial batch response configuration for resilient processing

## Implementation Paths
- **Code Location**: infrastructure/lib/infrastructure-stack.ts (add event source mapping)
- **Test Location**: infrastructure/test/ directory (add event source mapping tests)
- **Integration**: Connect worker Lambda to SQS queue for automatic processing

## Patterns & Best Practices
- **Batch Size Optimization**: Balance between throughput and processing efficiency
- **Concurrency Control**: Prevent resource exhaustion and API throttling
- **Batching Window**: Control latency vs throughput trade-offs
- **Partial Batch Responses**: Enable granular error handling and retry logic
- **Monitoring Integration**: Enable metrics for event source performance tracking
- **Cost Optimization**: Balance resource usage with processing requirements

## Key Design Decisions
- **Batch Size**: 5 messages per batch for balanced throughput and processing time
- **Maximum Concurrency**: 10 concurrent executions to prevent API overwhelming
- **Batching Window**: 5 seconds maximum for reasonable latency without excessive polling
- **Partial Batch Responses**: Enabled for fine-grained error handling and resilience
- **Event Filtering**: No filtering needed as all messages require processing
- **Error Handling**: Partial batch failures allow successful messages to complete

## Risks & Considerations
- **Concurrency Limits**: Lambda concurrency limits could affect processing throughput
- **Batch Size Impact**: Large batches could cause timeout issues during processing
- **Cost Impact**: High concurrency could increase Lambda execution costs
- **Error Propagation**: Partial batch failures need careful handling
- **Message Ordering**: Event source mapping doesn't guarantee strict ordering
- **Cold Start Impact**: Initial invocations may have higher latency

## Summary
This task establishes the event-driven connection between the SQS queue and worker Lambda, enabling automatic message processing with optimized batching, concurrency control, and error handling for production-ready asynchronous processing.
