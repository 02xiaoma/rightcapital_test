# Task: Detect Payload Size in Validation Lambda

## Description>
Add payload size detection logic to the validation Lambda to determine when S3 storage is needed for large request bodies.

## Background>
The system has a 256KB limit for direct message payloads. Larger payloads must be stored in S3 and referenced via presigned URLs to maintain performance and comply with SQS message size limits.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Measure request body size during validation
2. Compare against 256KB threshold for S3 requirement
3. Set flag indicating S3 storage is needed
4. Include size information in validation metadata
5. Update validation response to indicate storage method
6. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Validation Lambda from Step 2
- Understanding of payload size limits and S3 integration
- S3 bucket access for large payload storage

## Implementation Approach
1. Add payload size calculation to validation logic
2. Implement threshold comparison for S3 decision
3. Update validation metadata with size and storage flags
4. Modify validation response to include storage requirements
5. Test size detection with various payload sizes
6. Integrate with S3 upload logic in subsequent tasks

## Acceptance Criteria

1. **Size Calculation**
   - Given request body
   - When validation runs
   - Then payload size is accurately calculated

2. **Threshold Comparison**
   - Given payload size
   - When compared to 256KB limit
   - Then S3 requirement is correctly determined

3. **Metadata Update**
   - Given size detection
   - When validation completes
   - Then storage method flag is included in response

4. **Response Enhancement**
   - Given large payload
   - When validation succeeds
   - Then response indicates S3 storage requirement

5. **Edge Case Handling**
   - Given exactly 256KB payload
   - When size check runs
   - Then threshold boundary is handled correctly

## Metadata
- **Complexity**: Low
- **Labels**: Validation, Payload Size, S3, Threshold Detection, Storage Logic
- **Required Skills**: Node.js, Buffer Size Calculation, Conditional Logic, S3 Integration
