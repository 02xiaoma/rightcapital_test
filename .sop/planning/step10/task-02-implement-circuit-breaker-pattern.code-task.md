# Task: Implement Circuit Breaker Pattern

## Description>
Implement a circuit breaker pattern to protect against cascading failures when external APIs become unresponsive, allowing the system to fail fast and recover gracefully.

## Background>
When external APIs are consistently failing, continued attempts waste resources and can overwhelm recovering services. Circuit breakers detect failure patterns and temporarily stop requests to failing endpoints, allowing them time to recover.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Implement circuit breaker state management (closed, open, half-open)
2. Configure failure thresholds and recovery timeouts
3. Track success/failure rates per external endpoint
4. Return fast failure responses when circuit is open
5. Implement automatic recovery testing in half-open state
6. Add circuit breaker metrics and logging
7. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- HTTP client and timeout handling from previous tasks
- DynamoDB for circuit breaker state storage
- Understanding of circuit breaker patterns

## Implementation Approach
1. Create circuit breaker state management logic
2. Implement failure threshold tracking
3. Add circuit open/close logic
4. Integrate with HTTP request execution
5. Add state persistence and recovery
6. Test circuit breaker behavior with failing endpoints

## Acceptance Criteria

1. **State Management**
   - Given circuit breaker implementation
   - When failure threshold is reached
   - Then circuit opens and blocks requests

2. **Fast Failure Response**
   - Given open circuit
   - When request is attempted
   - Then immediate failure is returned without external call

3. **Recovery Testing**
   - Given half-open circuit
   - When recovery timeout expires
   - Then single test request is allowed

4. **State Persistence**
   - Given circuit state changes
   - When persisted to DynamoDB
   - Then state survives Lambda container restarts

5. **Metrics Collection**
   - Given circuit breaker events
   - When metrics are published
   - Then circuit state changes are tracked

## Metadata
- **Complexity**: High
- **Labels**: Circuit Breaker, Resilience, External APIs, Failure Handling, State Management
- **Required Skills**: Circuit Breaker Patterns, State Machines, DynamoDB, Error Handling
