# Requirements Clarification

## Question 1: What are the specific reliability guarantees required for notification delivery?

Possible options:
- At least once delivery (notifications may be duplicated but none lost)
- At most once delivery (no duplicates but may lose some)
- Exactly once delivery (guaranteed no loss or duplication)
- Best effort (no strong guarantees)

## Answer 1:
Exactly once delivery (guaranteed no loss or duplication)

## Question 2: What are the expected performance requirements for the notification system, including throughput (e.g., notifications per second) and latency (e.g., time from request to delivery)?

## Answer 2:
Notification num per second: 100000, latency: 10s. But no strict SLA of how long message could be delivered.

## Question 3: What is the expected retry and failure handling strategy for notifications that fail to deliver?

Possible considerations:
- Number of retry attempts
- Backoff strategy (e.g., exponential backoff)
- Handling of different error types (4xx vs 5xx)
- Dead letter queue for permanently failed notifications
- Alerting for high failure rates

## Answer 3:
- Number of retry attempts: 3
- Backoff strategy: exponential backoff with random delay to prevent retry storm
- Handling of different error types: don't take this into consideration for simplify.
- Dead letter queue for permanently failed notifications: sure we need this
- Alerting for high failure rates: we could add metrics but ignore the alarm/dashboard for simplify.

## Question 4: What should be the API interface for internal business systems to submit notifications?

Considerations:
- HTTP method and endpoint
- Request body format (e.g., JSON with target URL, method, headers, body)
- Idempotency mechanism for exactly once delivery
- Authentication/authorization
- Expected response format

## Answer 4:
- HTTP method and endpoint: it could be a internal endpoint, like 'http://message-sender/message'
- Request body format: JSON with target endpoint and url, target http method, target body, the implementation should detect how to call target destination by itself (maybe by config).
- Idempotency mechanism for exactly once delivery: messageid + timestamp + senderid + destination endpoint could be used to keep Idempotency, note that message id must be provided by client.
- Authentication/authorization: as this is internal service, we could assume there exist auth solutions, for this design we could use AWS IAM as example.
- Expected response format: response would be ignored by client so you can return 200 if the request is valid and message could be sent. For other exceptions you could help design some error codes. Notice that the real message sending would happen async after the client send message call.

## Question 5: What edge cases or special scenarios should the system handle?

Examples:
- Large request/response payloads
- Slow or unresponsive external APIs
- Network timeouts and connectivity issues
- High concurrency or burst traffic
- Malformed requests from internal systems

## Answer 5:
- Large request payloads: for simplyfy we could set 256KB limit of the payload size. We could add a new API to handle the big size payload: the client would firstly upload big payload to AWS S3 then create presigned url link and include that url in payload. We could abstract this in client logics that auto detect which API to call. Note that as response payload will never exceed size limit.
- Slow or unresponsive external APIs: just put message into DLQ and add metrics, so clients could know which message failed to diliver and could handle it manually offline.
- Network timeouts and connectivity issues: we could add health check for our service and our dependencies.
- High concurrency or burst traffic: our own service should support max 100000 QPS, but the message itself could be sent async and we would have metrics of for each client how many messages come to our service and how many messages delivered successfully, so clients could add alarm and be notified when too many message delay.
- Malformed requests from internal systems: the client logic should do validation, and our service should do validation too and quickly return error for malformed requests. We should also have metrics of each client sending malformed requests so we can create alarm on this later to help quickly identify malformed clients.