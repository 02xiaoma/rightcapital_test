# Task: Create Worker Lambda Construct

## Description
Implement a CDK construct for the worker Lambda function that will process messages from the SQS queue asynchronously.

## Background
The worker Lambda is the core processing component that handles message delivery. As a separate function from the API handler, it enables independent scaling and processing of queued messages, forming the backbone of the async processing pipeline.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Create worker Lambda function construct with Node.js runtime
2. Configure appropriate memory allocation and timeout for processing
3. Set up execution role with permissions for DynamoDB, SQS, and CloudWatch
4. Configure CloudWatch Logs group for worker logging
5. Export function ARN for SQS event source mapping
6. Use CDK to deploy with fake account ID (123456789012)

## Dependencies
- CDK project from Step 1
- Understanding of Lambda event-driven architecture
- SQS and DynamoDB permissions

## Implementation Approach
1. Import Lambda constructs into CDK stack
2. Define worker function with appropriate configuration
3. Create IAM role with necessary permissions
4. Configure logging and monitoring
5. Test function deployment and basic execution
6. Integrate with existing infrastructure

## Acceptance Criteria

1. **Function Definition**
   - Given CDK construct code
   - When synthesized
   - Then CloudFormation contains worker Lambda function

2. **Runtime Configuration**
   - Given worker function
   - When checking settings
   - Then Node.js runtime and appropriate resources are configured

3. **IAM Permissions**
   - Given execution role
   - When examining policies
   - Then role has access to DynamoDB, SQS, and CloudWatch

4. **Logging Setup**
   - Given function configuration
   - When deployed
   - Then CloudWatch Logs group is created for worker logs

5. **Function ARN Export**
   - Given construct exports
   - When referenced by other constructs
   - Then worker function ARN is available

## Metadata
- **Complexity**: Low
- **Labels**: Lambda, CDK, Worker, Async Processing, Event-Driven
- **Required Skills**: AWS CDK, Lambda, IAM, Serverless Architecture
