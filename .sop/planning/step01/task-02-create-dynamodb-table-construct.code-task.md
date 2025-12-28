# Task: Create DynamoDB Table Construct

## Description
Implement a CDK construct for the DynamoDB table that handles message deduplication and status tracking, providing persistent storage for exactly-once delivery semantics.

## Background
The DynamoDB table is critical for the API Notification System's reliability guarantees. It stores message metadata using a composite key structure to prevent duplicate processing and tracks delivery status, attempt counts, and error information for each notification.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Define DynamoDB table with composite primary key (partition key: messageId#senderId, sort key: timestamp#targetUrl)
2. Configure table attributes for status, attempts, lastAttempt, error, and ttl fields
3. Set up on-demand billing mode for cost-effective scaling
4. Configure TTL (time-to-live) for automatic cleanup of old records
5. Add CloudWatch alarms for read/write capacity and errors
6. Export table ARN and name for cross-stack references

## Dependencies
- AWS CDK core and DynamoDB construct libraries
- Completed CDK project initialization from previous task
- Understanding of DynamoDB key design and TTL configuration

## Implementation Approach
1. Import DynamoDB constructs from AWS CDK
2. Define table schema with required attributes and key structure
3. Configure billing mode and capacity settings
4. Set up TTL configuration for automatic data expiration
5. Add CloudWatch alarms for monitoring table health
6. Export table properties for use in other constructs

## Acceptance Criteria

1. **Table Schema Definition**
   - Given CDK construct code
   - When table is synthesized
   - Then CloudFormation template contains correct key schema and attributes

2. **Composite Key Configuration**
   - Given DynamoDB table definition
   - When examining partition and sort keys
   - Then keys match design specification (messageId#senderId, timestamp#targetUrl)

3. **TTL Configuration**
   - Given table construct
   - When deployed
   - Then TTL is enabled on appropriate timestamp attribute

4. **Billing Mode Setup**
   - Given table configuration
   - When checking CloudFormation template
   - Then on-demand billing mode is configured

5. **CloudWatch Integration**
   - Given table construct
   - When synthesized
   - Then CloudWatch alarms are created for table metrics

## Metadata
- **Complexity**: Low
- **Labels**: AWS, DynamoDB, CDK, Storage, Infrastructure
- **Required Skills**: AWS CDK, DynamoDB, NoSQL Design, CloudFormation
