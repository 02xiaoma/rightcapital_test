# Task: Add Retry Eligibility Determination

## Description>
Implement logic to determine whether failed HTTP deliveries should be retried based on response characteristics and error types.

## Background>
Not all delivery failures warrant retries. Client errors (4xx) typically indicate permanent issues that shouldn't be retried, while server errors (5xx) and network issues are often transient and should trigger retry attempts.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Analyze HTTP response codes to categorize error types
2. Implement retry eligibility rules (4xx = no retry, 5xx = retry)
3. Consider network errors and timeouts as retryable
4. Add configurable retry limits per error type
5. Return structured retry decision data
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- HTTP response handling from Step 5
- Error categorization logic
- Retry policy configuration

## Implementation Approach
1. Create retry decision function based on HTTP status codes
2. Implement error type classification logic
3. Add network and timeout error handling
4. Configure retry eligibility rules
5. Test decision logic with various failure scenarios
6. Integrate with existing delivery outcome processing

## Acceptance Criteria

1. **4xx Error Handling**
   - Given HTTP 4xx response
   - When retry eligibility is determined
   - Then retry is marked as ineligible

2. **5xx Error Handling**
   - Given HTTP 5xx response
   - When retry eligibility is determined
   - Then retry is marked as eligible

3. **Network Error Handling**
   - Given network timeout or connection error
   - When retry eligibility is determined
   - Then retry is marked as eligible

4. **Structured Decision Output**
   - Given any failure scenario
   - When decision is made
   - Then structured data includes eligibility flag and reason

5. **Configuration Support**
   - Given configurable retry policies
   - When decisions are made
   - Then rules can be adjusted without code changes

## Metadata
- **Complexity**: Low
- **Labels**: Retry Logic, Error Classification, HTTP Status Codes, Failure Handling
- **Required Skills**: HTTP Protocols, Error Handling, Decision Logic, Configuration Management
