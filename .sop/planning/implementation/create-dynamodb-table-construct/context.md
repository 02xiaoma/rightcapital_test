# Implementation Context: Create DynamoDB Table Construct

## Project Structure
- **Root Directory**: /Users/02xiaoma/Downloads/RightCapital/rightcapital_test
- **CDK Project Location**: infrastructure/ subdirectory
- **Technology Stack**: AWS CDK v2, TypeScript, DynamoDB
- **Current Infrastructure**: Basic CDK project initialized with InfrastructureStack

## Requirements Analysis
The task requires creating a DynamoDB table construct for the API Notification System with specific schema requirements:

### Functional Requirements
- Create DynamoDB table with composite primary key
- Configure table attributes for message tracking
- Set up on-demand billing mode
- Configure TTL for automatic cleanup
- Add CloudWatch monitoring
- Export table properties for cross-stack references

### Non-Functional Requirements
- Follow CDK best practices
- Ensure table schema matches design specifications
- Provide monitoring and alerting capabilities
- Support exactly-once delivery semantics

### Acceptance Criteria
- Table schema matches design (composite key structure)
- TTL configured for automatic cleanup
- CloudWatch alarms created
- Table properties exported correctly
- On-demand billing mode configured

## Existing Documentation
**Design Document**: design/detailed-design.md contains table schema specifications

**Previous Implementation**: CDK project initialized in infrastructure/ directory with basic stack structure

## Dependencies & Technology Stack
- **AWS CDK**: DynamoDB constructs from aws-cdk-lib/dynamodb
- **Infrastructure Stack**: Existing InfrastructureStack class to extend
- **DynamoDB Knowledge**: Understanding of composite keys, TTL, and billing modes

## Implementation Paths
- **Code Location**: infrastructure/lib/ directory
- **Test Location**: infrastructure/test/ directory
- **Integration**: Add DynamoDB construct to InfrastructureStack

## Patterns & Best Practices
- **CDK Constructs**: Use TableV2 for latest DynamoDB features
- **Key Design**: Composite primary key for deduplication
- **Billing**: On-demand for cost-effective scaling
- **TTL**: Automatic cleanup of old records
- **Monitoring**: CloudWatch alarms for table health

## Key Design Decisions
- **Table Name**: Use CDK-generated name or configurable name
- **Key Schema**: 
  - Partition Key: messageId#senderId (string)
  - Sort Key: timestamp#targetUrl (string)
- **Attributes**: status, attempts, lastAttempt, error, ttl
- **Billing Mode**: On-demand (PAY_PER_REQUEST)
- **TTL**: Enabled on timestamp attribute

## Risks & Considerations
- Key schema must match Lambda implementation expectations
- TTL configuration affects data retention
- CloudWatch alarms may incur additional costs
- Table naming must be unique across accounts

## Summary
This task creates the foundational DynamoDB table construct that will store message metadata and enable deduplication and status tracking for the API Notification System. The table design supports exactly-once delivery semantics and provides monitoring capabilities.
