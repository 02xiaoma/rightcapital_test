# Task: Add Custom Metrics Publishing to Lambdas

## Description>
Implement custom CloudWatch metrics publishing in Lambda functions to track message processing statistics and system performance.

## Background>
Custom metrics provide detailed observability into system behavior beyond default AWS metrics. Tracking message counts, processing times, and success rates enables proactive monitoring and performance optimization.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Add CloudWatch metrics publishing to API Lambda (message acceptance rate)
2. Add metrics to worker Lambda (processing success/failure, latency)
3. Implement custom metrics for throughput and error rates
4. Use appropriate metric dimensions (e.g., by endpoint, error type)
5. Handle metrics publishing failures gracefully
6. Use CDK to deploy updated Lambda functions with fake account ID (123456789012)

## Dependencies
- Lambda functions from previous steps
- AWS SDK CloudWatch client
- Understanding of CloudWatch custom metrics

## Implementation Approach
1. Import CloudWatch SDK into Lambda functions
2. Create metrics publishing utility functions
3. Add metrics calls at key processing points
4. Implement async metrics publishing to avoid blocking
5. Test metrics publishing with sample data
6. Verify metrics appear in CloudWatch console

## Acceptance Criteria

1. **Metrics Publishing**
   - Given Lambda function execution
   - When processing completes
   - Then custom metrics are published to CloudWatch

2. **API Metrics**
   - Given message acceptance
   - When API Lambda processes
   - Then acceptance rate metrics are recorded

3. **Worker Metrics**
   - Given message processing
   - When worker Lambda executes
   - Then success/failure metrics are published

4. **Latency Tracking**
   - Given processing duration
   - When worker completes
   - Then processing latency metrics are recorded

5. **CloudWatch Visibility**
   - Given published metrics
   - When checking CloudWatch console
   - Then custom metrics are visible with correct dimensions

## Metadata
- **Complexity**: Medium
- **Labels**: CloudWatch, Metrics, Lambda, Monitoring, Observability
- **Required Skills**: AWS SDK, CloudWatch, Custom Metrics, Lambda Integration
