# Task: Add Timeout Handling for External API Calls

## Description>
Implement configurable timeout handling for HTTP requests to external APIs to prevent hanging connections and improve system responsiveness.

## Background>
External API calls can hang indefinitely without proper timeout configuration, leading to Lambda function timeouts and resource waste. Configurable timeouts ensure the system remains responsive even when external services are slow or unresponsive.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Configure HTTP client timeout settings (connection, read, total)
2. Implement configurable timeout values per external API
3. Handle timeout exceptions and convert to appropriate error responses
4. Add timeout metrics for monitoring slow external services
5. Ensure timeouts don't exceed Lambda function limits
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- HTTP client integration from Step 5
- Error handling and response formatting from Step 2
- Understanding of HTTP timeout configurations

## Implementation Approach
1. Configure HTTP client with timeout settings
2. Implement timeout exception handling
3. Add timeout metrics and logging
4. Test timeout behavior with slow endpoints
5. Integrate with existing error handling
6. Validate Lambda timeout coordination

## Acceptance Criteria

1. **Timeout Configuration**
   - Given HTTP client setup
   - When timeouts are configured
   - Then connection, read, and total timeouts are set

2. **Timeout Exception Handling**
   - Given external API timeout
   - When request fails
   - Then timeout exception is caught and handled

3. **Error Response Generation**
   - Given timeout occurrence
   - When error response is created
   - Then appropriate timeout error is returned

4. **Metrics Collection**
   - Given timeout events
   - When metrics are published
   - Then timeout counts are tracked in CloudWatch

5. **Lambda Timeout Coordination**
   - Given HTTP timeouts
   - When configured
   - Then HTTP timeouts are less than Lambda timeout

## Metadata
- **Complexity**: Low
- **Labels**: HTTP, Timeouts, Error Handling, External APIs, Resilience
- **Required Skills**: HTTP Clients, Timeout Configuration, Error Handling, Lambda Limits
