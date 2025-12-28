# Task: Implement Request Validation in Lambda

## Description
Update the Lambda handler to parse JSON request bodies and implement comprehensive validation for all required fields according to the API specification.

## Background
Request validation is the first line of defense in the API Notification System, ensuring that only properly formatted requests are processed. This prevents invalid data from entering the system and provides clear error messages to clients.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Update Lambda handler to parse JSON request body from API Gateway event
2. Validate presence and format of required fields: messageId, timestamp, senderId, targetUrl
3. Validate optional fields: method (defaults to POST), headers, body
4. Implement type checking and basic format validation
5. Return structured error responses for validation failures
6. Use CDK to deploy updated Lambda function with fake account ID (123456789012)

## Dependencies
- Completed Step 1 infrastructure (API Gateway, Lambda, DynamoDB)
- AWS SDK for Lambda handler
- Understanding of API Gateway Lambda proxy integration

## Implementation Approach
1. Update Lambda handler code to extract body from event
2. Implement JSON parsing with error handling
3. Create validation functions for each required field
4. Add comprehensive error messaging for different failure types
5. Test validation logic with various input scenarios
6. Deploy updated function using CDK

## Acceptance Criteria

1. **JSON Parsing**
   - Given valid JSON request body
   - When Lambda handler processes request
   - Then body is correctly parsed into JavaScript object

2. **Required Field Validation**
   - Given request missing messageId
   - When validation runs
   - Then 400 error returned with specific error message

3. **Field Format Validation**
   - Given invalid timestamp format
   - When validation runs
   - Then 400 error returned with format error details

4. **Valid Request Processing**
   - Given complete valid request
   - When validation passes
   - Then processing continues to next step

5. **Error Response Format**
   - Given validation failure
   - When error response is returned
   - Then response includes error code and descriptive message

## Metadata
- **Complexity**: Low
- **Labels**: Lambda, Validation, API, JSON, Error Handling
- **Required Skills**: Node.js, Lambda, API Gateway, JSON Validation
