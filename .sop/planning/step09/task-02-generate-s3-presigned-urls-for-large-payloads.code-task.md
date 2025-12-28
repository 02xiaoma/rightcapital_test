# Task: Generate S3 Presigned URLs for Large Payloads

## Description>
Implement S3 presigned URL generation in the validation Lambda for payloads exceeding the 256KB limit.

## Background>
Large payloads cannot be sent directly in SQS messages due to size limits. Instead, the payload is uploaded to S3 and a presigned URL is generated for temporary access, allowing the worker to download the content when needed.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Upload large payloads to S3 bucket
2. Generate presigned URLs with appropriate expiration (1 hour)
3. Replace payload in request with S3 URL
4. Handle S3 upload failures gracefully
5. Update validation response with S3 URL information
6. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- S3 bucket and IAM permissions from infrastructure
- Payload size detection from previous task
- AWS SDK S3 client for upload and URL generation

## Implementation Approach
1. Add S3 client to validation Lambda
2. Implement payload upload to S3 for large requests
3. Generate presigned URLs with secure parameters
4. Update request data to use S3 URL instead of payload
5. Handle upload errors and fallback scenarios
6. Test URL generation with various payload sizes

## Acceptance Criteria

1. **S3 Upload**
   - Given large payload
   - When validation runs
   - Then payload is uploaded to S3 bucket

2. **URL Generation**
   - Given successful upload
   - When URL generation executes
   - Then presigned URL is created with proper expiration

3. **Payload Replacement**
   - Given original payload
   - When S3 processing completes
   - Then request contains S3 URL instead of original payload

4. **Error Handling**
   - Given S3 upload failure
   - When processing occurs
   - Then appropriate error response is returned

5. **URL Expiration**
   - Given generated URL
   - When checked
   - Then URL has appropriate temporary access duration

## Metadata
- **Complexity**: Medium
- **Labels**: S3, Presigned URLs, Large Payloads, Upload, Storage
- **Required Skills**: AWS SDK, S3 Operations, URL Generation, File Upload
