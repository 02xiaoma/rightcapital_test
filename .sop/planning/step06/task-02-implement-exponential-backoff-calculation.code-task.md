# Task: Implement Exponential Backoff Calculation

## Description>
Develop exponential backoff algorithm with jitter to calculate retry delays that prevent thundering herd problems and optimize retry timing.

## Background>
Fixed retry intervals can cause all failed requests to retry simultaneously, overwhelming recovering services. Exponential backoff with jitter distributes retry attempts over time, improving system stability and success rates.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Implement exponential backoff formula: delay = base_delay * (2 ^ attempt_number)
2. Add random jitter to prevent synchronized retries
3. Configure maximum delay cap (60 seconds)
4. Ensure delays stay within reasonable bounds
5. Return calculated delay for SQS message scheduling
6. Use CDK to deploy updated worker function with fake account ID (123456789012)

## Dependencies
- Retry eligibility determination from previous task
- Attempt count tracking from DynamoDB
- Random number generation for jitter

## Implementation Approach
1. Create backoff calculation function with exponential growth
2. Implement jitter addition using random offset
3. Add maximum delay constraints
4. Test calculation with various attempt numbers
5. Integrate with retry decision logic
6. Validate distribution prevents thundering herd

## Acceptance Criteria

1. **Exponential Growth**
   - Given attempt number 1
   - When backoff is calculated
   - Then delay follows exponential increase pattern

2. **Jitter Application**
   - Given same attempt number
   - When backoff is calculated multiple times
   - Then delays vary due to random jitter

3. **Maximum Delay Cap**
   - Given high attempt numbers
   - When backoff is calculated
   - Then delay does not exceed maximum configured value

4. **Reasonable Bounds**
   - Given attempt numbers 1-3
   - When delays are calculated
   - Then values stay within practical retry timeframes

5. **SQS Compatibility**
   - Given calculated delay
   - When used with MessageDelaySeconds
   - Then SQS accepts the value for message scheduling

## Metadata
- **Complexity**: Low
- **Labels**: Exponential Backoff, Jitter, Retry Logic, Timing, Thundering Herd Prevention
- **Required Skills**: Algorithms, Random Number Generation, Exponential Functions, SQS Configuration
