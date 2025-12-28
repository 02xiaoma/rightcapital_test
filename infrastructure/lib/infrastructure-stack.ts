import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';

export class InfrastructureStack extends cdk.Stack {
  public readonly table: dynamodb.TableV2;
  public readonly tableName: string;
  public readonly tableArn: string;
  public readonly queue: sqs.Queue;
  public readonly queueUrl: string;
  public readonly queueArn: string;
  public readonly function: lambda.Function;
  public readonly functionName: string;
  public readonly functionArn: string;
  public readonly workerFunction: lambda.Function;
  public readonly workerFunctionName: string;
  public readonly workerFunctionArn: string;
  public readonly api: apigateway.RestApi;
  public readonly apiEndpoint: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log('Creating InfrastructureStack...');

    // Create DynamoDB table for message deduplication and status tracking
    this.table = new dynamodb.TableV2(this, 'MessageTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      // Enable TTL for automatic cleanup
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
    });

    console.log('DynamoDB table created:', this.table.tableName);

    // Create SQS queue for message buffering with optimized settings for high-throughput
    this.queue = new sqs.Queue(this, 'MessageQueue', {
      visibilityTimeout: cdk.Duration.seconds(30), // Match Lambda timeout to prevent duplicate processing
      retentionPeriod: cdk.Duration.days(4), // 4 days retention for adequate processing buffer
      deliveryDelay: cdk.Duration.seconds(0), // Immediate delivery for high-throughput scenarios
      receiveMessageWaitTime: cdk.Duration.seconds(20), // Long polling for efficiency (max 20 seconds)
      maxMessageSizeBytes: 262144, // Maximum message size (256 KB) for comprehensive payloads
      encryption: sqs.QueueEncryption.SQS_MANAGED, // Server-side encryption for security
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
    });

    console.log('SQS queue created:', this.queue.queueName);

    // Add CloudWatch alarm for SQS queue depth
    const queueDepthAlarm = new cloudwatch.Alarm(this, 'QueueDepthAlarm', {
      alarmName: `${this.stackName}-SQS-QueueDepth`,
      alarmDescription: 'SQS queue has too many messages',
      metric: this.queue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1000,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // Create Lambda function for API handler
    this.function = new lambda.Function(this, 'ApiHandlerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromInline(`
        // Enhanced error response formatting with structured error codes
        function createErrorResponse(errorCode, message, statusCode = 400) {
          return {
            statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
              'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({
              error: errorCode,
              message,
              timestamp: new Date().toISOString(),
              requestId: event.requestContext?.requestId || 'unknown'
            })
          };
        }

        function isValidUrl(string) {
          try {
            new URL(string);
            return true;
          } catch (_) {
            return false;
          }
        }

        function isValidTimestamp(timestamp) {
          const date = new Date(timestamp);
          return date instanceof Date && !isNaN(date) && date.toISOString() === timestamp;
        }

        function isValidHttpMethod(method) {
          const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
          return validMethods.includes(method.toUpperCase());
        }

        exports.handler = async (event) => {
          console.log('Processing request validation:', {
            requestId: event.requestContext?.requestId,
            httpMethod: event.httpMethod || event.requestContext?.http?.method,
            path: event.path,
            logLevel: process.env.LOG_LEVEL,
            serviceName: process.env.SERVICE_NAME
          });

          // Handle OPTIONS for CORS preflight
          if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
              },
              body: ''
            };
          }

          // Parse JSON body
          let requestBody;
          try {
            requestBody = JSON.parse(event.body || '{}');
          } catch (error) {
            console.error('JSON parsing error:', error);
            return createErrorResponse('INVALID_JSON', 'Request body must be valid JSON');
          }

          // Validate required fields
          const requiredFields = ['messageId', 'timestamp', 'senderId', 'targetUrl'];
          for (const field of requiredFields) {
            if (!requestBody[field]) {
              return createErrorResponse('VALIDATION_ERROR', \`Missing required field: \${field}\`);
            }
          }

          // Validate field types and formats
          if (typeof requestBody.messageId !== 'string' || requestBody.messageId.trim() === '') {
            return createErrorResponse('VALIDATION_ERROR', 'messageId must be a non-empty string');
          }

          if (!isValidTimestamp(requestBody.timestamp)) {
            return createErrorResponse('VALIDATION_ERROR', 'timestamp must be a valid ISO 8601 datetime string');
          }

          if (typeof requestBody.senderId !== 'string' || requestBody.senderId.trim() === '') {
            return createErrorResponse('VALIDATION_ERROR', 'senderId must be a non-empty string');
          }

          if (!isValidUrl(requestBody.targetUrl)) {
            return createErrorResponse('VALIDATION_ERROR', 'targetUrl must be a valid URL');
          }

          // Validate optional fields
          if (requestBody.method !== undefined) {
            if (typeof requestBody.method !== 'string' || !isValidHttpMethod(requestBody.method)) {
              return createErrorResponse('VALIDATION_ERROR', 'method must be a valid HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD)');
            }
          } else {
            // Default to POST if not provided
            requestBody.method = 'POST';
          }

          if (requestBody.headers !== undefined && typeof requestBody.headers !== 'object') {
            return createErrorResponse('VALIDATION_ERROR', 'headers must be an object if provided');
          }

          if (requestBody.body !== undefined && typeof requestBody.body !== 'string' && typeof requestBody.body !== 'object') {
            return createErrorResponse('VALIDATION_ERROR', 'body must be a string or object if provided');
          }

          // Perform deduplication check using DynamoDB
          console.log('Performing deduplication check:', {
            messageId: requestBody.messageId,
            senderId: requestBody.senderId,
            logLevel: process.env.LOG_LEVEL,
            serviceName: process.env.SERVICE_NAME
          });

          // Construct composite key
          const partitionKey = requestBody.messageId + '#' + requestBody.senderId;
          const sortKey = requestBody.timestamp + '#' + requestBody.targetUrl;

          try {
            const AWS = require('aws-sdk');
            const dynamodb = new AWS.DynamoDB.DocumentClient();

            const getItemParams = {
              TableName: process.env.DYNAMODB_TABLE_NAME || 'NotificationMessages',
              Key: {
                pk: partitionKey,
                sk: sortKey
              }
            };

            console.log('Querying DynamoDB for deduplication:', {
              partitionKey,
              sortKey,
              tableName: getItemParams.TableName
            });

            const result = await dynamodb.get(getItemParams).promise();

            if (result.Item) {
              // Duplicate message found - return success (idempotent)
              console.log('Duplicate message detected:', {
                messageId: requestBody.messageId,
                existingItem: result.Item,
                duplicateDetected: true
              });

              return {
                statusCode: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                  'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({
                  message: 'Duplicate message accepted (idempotent)',
                  requestId: event.requestContext?.requestId || 'unknown',
                  timestamp: new Date().toISOString(),
                  duplicateDetected: true,
                  messageId: requestBody.messageId,
                  senderId: requestBody.senderId
                })
              };
            }

            // No duplicate found - proceed with processing
            console.log('No duplicate found, proceeding with processing:', {
              messageId: requestBody.messageId,
              duplicateDetected: false
            });

          } catch (error) {
            // DynamoDB error - log and continue processing (fail open for availability)
            console.error('DynamoDB deduplication check failed:', {
              error: error.message,
              messageId: requestBody.messageId,
              senderId: requestBody.senderId,
              tableName: process.env.DYNAMODB_TABLE_NAME
            });

            // For production, you might want to return an error instead of continuing
            // return createErrorResponse('DEDUPLICATION_ERROR', 'Failed to check for duplicate messages');

            // For now, continue processing if deduplication fails
            console.log('Continuing processing despite deduplication failure');
          }

          // Store message metadata in DynamoDB
          console.log('Storing message metadata:', {
            messageId: requestBody.messageId,
            senderId: requestBody.senderId,
            tableName: process.env.DYNAMODB_TABLE_NAME
          });

          try {
            const AWS = require('aws-sdk');
            const dynamodb = new AWS.DynamoDB.DocumentClient();

            // Calculate TTL (default 30 days from now)
            const ttlSeconds = parseInt(process.env.MESSAGE_RETENTION_DAYS || '30') * 24 * 60 * 60;
            const ttlTimestamp = Math.floor(Date.now() / 1000) + ttlSeconds;

            // Prepare message metadata for storage
            const messageMetadata = {
              pk: requestBody.messageId + '#' + requestBody.senderId,
              sk: requestBody.timestamp + '#' + requestBody.targetUrl,
              messageId: requestBody.messageId,
              senderId: requestBody.senderId,
              timestamp: requestBody.timestamp,
              targetUrl: requestBody.targetUrl,
              status: 'PENDING',
              attempts: 0,
              ttl: ttlTimestamp,
              createdAt: new Date().toISOString(),
              requestId: event.requestContext?.requestId || 'unknown'
            };

            // Add optional fields if present
            if (requestBody.method !== undefined) {
              messageMetadata.method = requestBody.method;
            }
            if (requestBody.headers !== undefined) {
              messageMetadata.headers = requestBody.headers;
            }
            if (requestBody.body !== undefined) {
              messageMetadata.body = requestBody.body;
            }

            // Store message metadata
            const putParams = {
              TableName: process.env.DYNAMODB_TABLE_NAME || 'NotificationMessages',
              Item: messageMetadata
            };

            await dynamodb.put(putParams).promise();

            console.log('Message metadata stored successfully:', {
              messageId: requestBody.messageId,
              status: 'PENDING',
              ttl: ttlTimestamp,
              tableName: putParams.TableName
            });

            // Validation and deduplication successful - return success response
            console.log('Request validation, deduplication, and storage successful:', {
              messageId: requestBody.messageId,
              senderId: requestBody.senderId,
              method: requestBody.method,
              duplicateDetected: false,
              stored: true
            });

            // Send message to SQS queue for processing
            console.log('Sending message to SQS queue:', {
              messageId: requestBody.messageId,
              queueUrl: process.env.SQS_QUEUE_URL
            });

            try {
              const AWS = require('aws-sdk');
              const sqs = new AWS.SQS();

              // Prepare message payload for SQS
              const queueMessage = {
                messageId: requestBody.messageId,
                senderId: requestBody.senderId,
                timestamp: requestBody.timestamp,
                targetUrl: requestBody.targetUrl,
                method: requestBody.method || 'POST',
                headers: requestBody.headers || {},
                body: requestBody.body || '',
                correlationId: event.requestContext?.requestId || 'unknown',
                queuedAt: new Date().toISOString()
              };

              // Prepare message attributes for filtering and tracing
              const messageAttributes = {
                messageId: {
                  DataType: 'String',
                  StringValue: requestBody.messageId
                },
                senderId: {
                  DataType: 'String',
                  StringValue: requestBody.senderId
                },
                correlationId: {
                  DataType: 'String',
                  StringValue: event.requestContext?.requestId || 'unknown'
                }
              };

              // Send message to SQS
              const sendMessageParams = {
                QueueUrl: process.env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify(queueMessage),
                MessageAttributes: messageAttributes
              };

              try {
                await sqs.sendMessage(sendMessageParams).promise();

                console.log('Message successfully sent to SQS:', {
                  messageId: requestBody.messageId,
                  messageId: sendMessageParams.MessageAttributes.messageId.StringValue
                });
              } catch (sqsError) {
                // SQS send failed - rollback status and return error
                console.error('SQS send operation failed:', {
                  error: sqsError.message,
                  errorCode: sqsError.code,
                  messageId: requestBody.messageId,
                  senderId: requestBody.senderId,
                  queueUrl: process.env.SQS_QUEUE_URL,
                  correlationId: event.requestContext?.requestId || 'unknown'
                });

                // Attempt to rollback status from QUEUED to PENDING
                try {
                  console.log('Attempting status rollback from QUEUED to PENDING:', {
                    messageId: requestBody.messageId,
                    currentStatus: 'QUEUED',
                    targetStatus: 'PENDING'
                  });

                  const rollbackParams = {
                    TableName: process.env.DYNAMODB_TABLE_NAME || 'NotificationMessages',
                    Key: {
                      pk: messageMetadata.pk,
                      sk: messageMetadata.sk
                    },
                    UpdateExpression: 'SET #status = :newStatus',
                    ConditionExpression: 'attribute_exists(pk) AND #status = :currentStatus',
                    ExpressionAttributeNames: {
                      '#status': 'status'
                    },
                    ExpressionAttributeValues: {
                      ':newStatus': 'PENDING',
                      ':currentStatus': 'QUEUED'
                    },
                    ReturnValues: 'ALL_NEW'
                  };

                  await dynamodb.update(rollbackParams).promise();

                  console.log('Status rollback successful:', {
                    messageId: requestBody.messageId,
                    previousStatus: 'QUEUED',
                    newStatus: 'PENDING'
                  });

                } catch (rollbackError) {
                  // Rollback failed - log but still return error
                  console.error('Status rollback failed:', {
                    error: rollbackError.message,
                    messageId: requestBody.messageId,
                    attemptedRollback: 'QUEUED -> PENDING'
                  });

                  // Continue with error response - data consistency may be compromised
                  // but we still need to inform the client
                }

                // Return error response for SQS failure
                return createErrorResponse('SYSTEM_ERROR', 'An internal server error occurred');
              }

              // Update message status to QUEUED after successful SQS send
              console.log('Updating message status to QUEUED:', {
                messageId: requestBody.messageId,
                currentStatus: 'PENDING',
                newStatus: 'QUEUED'
              });

              try {
                const updateParams = {
                  TableName: process.env.DYNAMODB_TABLE_NAME || 'NotificationMessages',
                  Key: {
                    pk: messageMetadata.pk,
                    sk: messageMetadata.sk
                  },
                  UpdateExpression: 'SET #status = :newStatus',
                  ConditionExpression: 'attribute_exists(pk) AND #status = :currentStatus',
                  ExpressionAttributeNames: {
                    '#status': 'status'
                  },
                  ExpressionAttributeValues: {
                    ':newStatus': 'QUEUED',
                    ':currentStatus': 'PENDING'
                  },
                  ReturnValues: 'ALL_NEW'
                };

                const updateResult = await dynamodb.update(updateParams).promise();

                console.log('Message status updated to QUEUED:', {
                  messageId: requestBody.messageId,
                  previousStatus: 'PENDING',
                  newStatus: updateResult.Attributes.status,
                  updatedAt: new Date().toISOString()
                });

                // Return success response with queuing and status update confirmation
                console.log('Request validation, deduplication, storage, queuing, and status update successful:', {
                  messageId: requestBody.messageId,
                  senderId: requestBody.senderId,
                  method: requestBody.method,
                  duplicateDetected: false,
                  stored: true,
                  queued: true,
                  statusUpdated: true
                });

                return {
                  statusCode: 200,
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                  },
                  body: JSON.stringify({
                    message: 'Request validation successful',
                    requestId: event.requestContext?.requestId || 'unknown',
                    timestamp: new Date().toISOString(),
                    duplicateDetected: false,
                    stored: true,
                    queued: true,
                    statusUpdated: true,
                    messageId: requestBody.messageId,
                    storedMessage: {
                      messageId: updateResult.Attributes.messageId,
                      senderId: updateResult.Attributes.senderId,
                      status: updateResult.Attributes.status,
                      attempts: updateResult.Attributes.attempts,
                      ttl: updateResult.Attributes.ttl,
                      createdAt: updateResult.Attributes.createdAt
                    }
                  })
                };

              } catch (updateError) {
                // Status update failed - rollback by not returning success
                console.error('Status update failed:', {
                  error: updateError.message,
                  messageId: requestBody.messageId,
                  attemptedStatus: 'QUEUED'
                });

                return createErrorResponse('SYSTEM_ERROR', 'An internal server error occurred');
              }

            } catch (error) {
              // SQS send operation failed - return error
              console.error('SQS send operation failed:', {
                error: error.message,
                messageId: requestBody.messageId,
                senderId: requestBody.senderId,
                queueUrl: process.env.SQS_QUEUE_URL
              });

              return createErrorResponse('SYSTEM_ERROR', 'An internal server error occurred');
            }

          } catch (error) {
            // Storage operation failed - return error
            console.error('Message storage failed:', {
              error: error.message,
              messageId: requestBody.messageId,
              senderId: requestBody.senderId,
              tableName: process.env.DYNAMODB_TABLE_NAME
            });

            return createErrorResponse('SYSTEM_ERROR', 'An internal server error occurred');
          }
        };
      `),
      handler: 'index.handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production'
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    console.log('Lambda function created:', this.function.functionName);

    // Create worker Lambda function for message processing
    this.workerFunction = new lambda.Function(this, 'WorkerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromInline(`
        // Worker Lambda handler for SQS message processing
        exports.handler = async (event) => {
          console.log('Worker processing SQS messages:', {
            messageCount: event.Records?.length || 0,
            logLevel: process.env.LOG_LEVEL,
            serviceName: process.env.SERVICE_NAME,
            batchId: Date.now().toString()
          });

          const results = [];
          const startTime = Date.now();

          // Process each SQS message in the batch
          for (const record of event.Records || []) {
            const messageStartTime = Date.now();
            const correlationId = record.messageAttributes?.correlationId?.stringValue || 'unknown';

            try {
              console.log('Processing message:', {
                messageId: record.messageId,
                receiptHandle: record.receiptHandle?.substring(0, 20) + '...',
                correlationId,
                batchId: startTime.toString()
              });

              // Parse message body and extract delivery information
              let messageBody;
              try {
                messageBody = JSON.parse(record.body);
              } catch (parseError) {
                console.error('Failed to parse message body:', {
                  messageId: record.messageId,
                  correlationId,
                  error: parseError.message,
                  bodyPreview: record.body?.substring(0, 200)
                });

                results.push({
                  messageId: record.messageId,
                  status: 'failed',
                  error: 'INVALID_JSON',
                  correlationId
                });
                continue;
              }

              // Validate required message fields
              const requiredFields = ['messageId', 'targetUrl', 'method', 'correlationId'];
              const missingFields = requiredFields.filter(field => !messageBody[field]);

              if (missingFields.length > 0) {
                console.error('Message missing required fields:', {
                  messageId: record.messageId,
                  correlationId,
                  missingFields
                });

                results.push({
                  messageId: record.messageId,
                  status: 'failed',
                  error: 'MISSING_REQUIRED_FIELDS',
                  correlationId,
                  missingFields
                });
                continue;
              }

              // Log delivery information for debugging
              console.log('Message delivery details:', {
                messageId: messageBody.messageId,
                targetUrl: messageBody.targetUrl,
                method: messageBody.method,
                correlationId: messageBody.correlationId,
                hasHeaders: !!messageBody.headers,
                hasBody: !!messageBody.body,
                timestamp: messageBody.timestamp,
                senderId: messageBody.senderId
              });

              // Update message status from QUEUED to PROCESSING
              try {
                const AWS = require('aws-sdk');
                const dynamodb = new AWS.DynamoDB.DocumentClient();

                // Construct composite key for DynamoDB lookup
                const partitionKey = messageBody.messageId + '#' + messageBody.senderId;
                const sortKey = messageBody.timestamp + '#' + messageBody.targetUrl;

                console.log('Updating message status to PROCESSING:', {
                  messageId: messageBody.messageId,
                  correlationId,
                  partitionKey,
                  sortKey,
                  tableName: process.env.DYNAMODB_TABLE_NAME
                });

                const updateParams = {
                  TableName: process.env.DYNAMODB_TABLE_NAME || 'NotificationMessages',
                  Key: {
                    pk: partitionKey,
                    sk: sortKey
                  },
                  UpdateExpression: 'SET #status = :newStatus, processingStartedAt = :processingStartedAt, lastUpdatedAt = :lastUpdatedAt',
                  ConditionExpression: 'attribute_exists(pk) AND #status = :currentStatus',
                  ExpressionAttributeNames: {
                    '#status': 'status'
                  },
                  ExpressionAttributeValues: {
                    ':newStatus': 'PROCESSING',
                    ':currentStatus': 'QUEUED',
                    ':processingStartedAt': new Date().toISOString(),
                    ':lastUpdatedAt': new Date().toISOString()
                  },
                  ReturnValues: 'ALL_NEW'
                };

                const updateResult = await dynamodb.update(updateParams).promise();

                console.log('Message status updated to PROCESSING:', {
                  messageId: messageBody.messageId,
                  correlationId,
                  previousStatus: 'QUEUED',
                  newStatus: updateResult.Attributes.status,
                  processingStartedAt: updateResult.Attributes.processingStartedAt,
                  attempts: updateResult.Attributes.attempts
                });

                results.push({
                  messageId: record.messageId,
                  status: 'processing_started',
                  correlationId,
                  processingStartedAt: updateResult.Attributes.processingStartedAt
                });

              } catch (updateError) {
                console.error('Failed to update message status:', {
                  messageId: messageBody.messageId,
                  correlationId,
                  error: updateError.message,
                  errorCode: updateError.code,
                  tableName: process.env.DYNAMODB_TABLE_NAME
                });

                results.push({
                  messageId: record.messageId,
                  status: 'failed',
                  error: 'STATUS_UPDATE_FAILED',
                  correlationId,
                  updateError: updateError.message
                });
                continue;
              }

            } catch (error) {
              console.error('Error processing message:', {
                messageId: record.messageId,
                correlationId,
                error: error.message,
                stack: error.stack?.substring(0, 500),
                processingTime: Date.now() - messageStartTime
              });

              results.push({
                messageId: record.messageId,
                status: 'failed',
                error: error.message,
                correlationId,
                processingTime: Date.now() - messageStartTime
              });
            }
          }

          const totalProcessingTime = Date.now() - startTime;
          const successful = results.filter(r => r.status === 'processing_started').length;
          const failed = results.filter(r => r.status === 'failed').length;

          console.log('Worker processing complete:', {
            batchId: startTime.toString(),
            totalMessages: event.Records?.length || 0,
            successful,
            failed,
            totalProcessingTime,
            averageProcessingTime: totalProcessingTime / Math.max(event.Records?.length || 1, 1)
          });

          return {
            statusCode: 200,
            batchId: startTime.toString(),
            processedMessages: results.length,
            successful,
            failed,
            totalProcessingTime,
            results
          };
        };
      `),
      handler: 'index.handler',
      memorySize: 256, // Optimized for HTTP processing
      timeout: cdk.Duration.seconds(25), // Allow time for HTTP request completion
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    console.log('Worker Lambda function created:', this.workerFunction.functionName);

    // Add IAM policies for worker function
    // DynamoDB policy for worker
    const workerDynamoDBPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:Scan',
      ],
      resources: [this.table.tableArn],
    });

    // SQS policy for worker
    const workerSQSPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
      ],
      resources: [this.queue.queueArn],
    });

    // Attach policies to worker Lambda execution role
    this.workerFunction.addToRolePolicy(workerDynamoDBPolicy);
    this.workerFunction.addToRolePolicy(workerSQSPolicy);

    // Configure SQS event source mapping for automatic message processing
    this.workerFunction.addEventSource(new lambdaEventSources.SqsEventSource(this.queue, {
      batchSize: 5, // Process 5 messages per batch for balanced throughput
      maxConcurrency: 10, // Limit concurrent executions to prevent overwhelming APIs
      maxBatchingWindow: cdk.Duration.seconds(5), // Wait up to 5 seconds for batch completion
      reportBatchItemFailures: true, // Enable partial batch responses for error handling
    }));

    console.log('SQS event source mapping configured for worker Lambda');

    // Add IAM policies for API handler function
    // DynamoDB policy
    const dynamoDBPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:UpdateTimeToLive',
      ],
      resources: [this.table.tableArn],
    });

    // SQS policy
    const sqsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'sqs:SendMessage',
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
        'sqs:GetQueueUrl',
      ],
      resources: [this.queue.queueArn],
    });

    // Attach policies to API Lambda execution role
    this.function.addToRolePolicy(dynamoDBPolicy);
    this.function.addToRolePolicy(sqsPolicy);

    // Create API Gateway REST API
    this.api = new apigateway.RestApi(this, 'NotificationApi', {
      restApiName: 'NotificationAPI',
      description: 'API for submitting notification requests',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Create /message resource
    const messageResource = this.api.root.addResource('message');

    // Add POST method with Lambda integration
    messageResource.addMethod('POST', new apigateway.LambdaIntegration(this.function));

    // Create usage plan and API key for rate limiting
    const usagePlan = this.api.addUsagePlan('NotificationUsagePlan', {
      name: 'Notification API Usage Plan',
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      quota: {
        limit: 10000,
        period: apigateway.Period.DAY,
      },
    });

    const apiKey = this.api.addApiKey('NotificationApiKey', {
      apiKeyName: 'Notification API Key',
    });

    usagePlan.addApiKey(apiKey);

    console.log('API Gateway created:', this.api.restApiName);

    // Export properties
    this.functionName = this.function.functionName;
    this.functionArn = this.function.functionArn;
    this.workerFunctionName = this.workerFunction.functionName;
    this.workerFunctionArn = this.workerFunction.functionArn;
    this.apiEndpoint = this.api.url;

    // Export table properties for cross-stack references
    this.tableName = this.table.tableName;
    this.tableArn = this.table.tableArn;
    this.queueUrl = this.queue.queueUrl;
    this.queueArn = this.queue.queueArn;

    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB table name for message storage',
      exportName: `${this.stackName}-TableName`,
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      description: 'DynamoDB table ARN for message storage',
      exportName: `${this.stackName}-TableArn`,
    });

    new cdk.CfnOutput(this, 'QueueUrl', {
      value: this.queue.queueUrl,
      description: 'SQS queue URL for message processing',
      exportName: `${this.stackName}-QueueUrl`,
    });

    new cdk.CfnOutput(this, 'QueueArn', {
      value: this.queue.queueArn,
      description: 'SQS queue ARN for message processing',
      exportName: `${this.stackName}-QueueArn`,
    });

    new cdk.CfnOutput(this, 'FunctionName', {
      value: this.function.functionName,
      description: 'Lambda function name for API handler',
      exportName: `${this.stackName}-FunctionName`,
    });

    new cdk.CfnOutput(this, 'FunctionArn', {
      value: this.function.functionArn,
      description: 'Lambda function ARN for API handler',
      exportName: `${this.stackName}-FunctionArn`,
    });

    new cdk.CfnOutput(this, 'WorkerFunctionName', {
      value: this.workerFunction.functionName,
      description: 'Worker Lambda function name for message processing',
      exportName: `${this.stackName}-WorkerFunctionName`,
    });

    new cdk.CfnOutput(this, 'WorkerFunctionArn', {
      value: this.workerFunction.functionArn,
      description: 'Worker Lambda function ARN for message processing',
      exportName: `${this.stackName}-WorkerFunctionArn`,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway endpoint URL for notification submission',
      exportName: `${this.stackName}-ApiEndpoint`,
    });

    // Additional monitoring and integration enhancements

    // Add structured logging environment variables to Lambda
    this.function.addEnvironment('LOG_LEVEL', 'INFO');
    this.function.addEnvironment('SERVICE_NAME', 'notification-api');
    this.function.addEnvironment('DYNAMODB_TABLE_NAME', this.table.tableName);
    this.function.addEnvironment('MESSAGE_RETENTION_DAYS', '30');
    this.function.addEnvironment('SQS_QUEUE_URL', this.queue.queueUrl);

    // Add environment variables to worker Lambda
    this.workerFunction.addEnvironment('LOG_LEVEL', 'INFO');
    this.workerFunction.addEnvironment('SERVICE_NAME', 'notification-worker');
    this.workerFunction.addEnvironment('DYNAMODB_TABLE_NAME', this.table.tableName);

    // Configure API Gateway access logging
    const accessLogGroup = new logs.LogGroup(this, 'ApiGatewayAccessLogs', {
      logGroupName: `/aws/apigateway/${this.stackName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create additional CloudWatch alarms
    // Lambda errors alarm
    const lambdaErrorsAlarm = new cloudwatch.Alarm(this, 'LambdaErrorsAlarm', {
      alarmName: `${this.stackName}-Lambda-Errors`,
      alarmDescription: 'Lambda function is experiencing errors',
      metric: this.function.metricErrors(),
      threshold: 5,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // API Gateway errors alarm
    const apiErrorsAlarm = new cloudwatch.Alarm(this, 'ApiGatewayErrorsAlarm', {
      alarmName: `${this.stackName}-API-Gateway-Errors`,
      alarmDescription: 'API Gateway is experiencing 5xx errors',
      metric: this.api.metricServerError(),
      threshold: 10,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // DynamoDB throttles alarm
    const dynamoThrottlesAlarm = new cloudwatch.Alarm(this, 'DynamoDBThrottlesAlarm', {
      alarmName: `${this.stackName}-DynamoDB-Throttles`,
      alarmDescription: 'DynamoDB table is being throttled',
      metric: this.table.metricThrottledRequestsForOperations({
        operations: [dynamodb.Operation.PUT_ITEM, dynamodb.Operation.GET_ITEM, dynamodb.Operation.UPDATE_ITEM],
      }),
      threshold: 5,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    // Create CloudWatch dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'NotificationSystemDashboard', {
      dashboardName: 'NotificationSystem-Dashboard',
    });

    // Add widgets to dashboard
    dashboard.addWidgets(
      // API Gateway metrics
      new cloudwatch.GraphWidget({
        title: 'API Gateway Request Count',
        left: [this.api.metricCount()],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'API Gateway Latency',
        left: [this.api.metricLatency()],
        width: 12,
      }),
      // Lambda metrics
      new cloudwatch.GraphWidget({
        title: 'Lambda Invocations',
        left: [this.function.metricInvocations()],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Lambda Duration',
        left: [this.function.metricDuration()],
        width: 12,
      }),
      // DynamoDB metrics
      new cloudwatch.GraphWidget({
        title: 'DynamoDB Throttled Requests',
        left: [this.table.metricThrottledRequests()],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'DynamoDB Consumed Read Capacity',
        left: [this.table.metricConsumedReadCapacityUnits()],
        width: 12,
      }),
      // SQS metrics
      new cloudwatch.GraphWidget({
        title: 'SQS Queue Depth',
        left: [this.queue.metricApproximateNumberOfMessagesVisible()],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'SQS Messages Sent',
        left: [this.queue.metricNumberOfMessagesSent()],
        width: 12,
      }),
      // Error metrics
      new cloudwatch.GraphWidget({
        title: 'Error Rates',
        left: [
          this.function.metricErrors(),
          this.api.metricServerError(),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'SQS Messages Deleted',
        left: [this.queue.metricNumberOfMessagesDeleted()],
        width: 12,
      })
    );

    // Add resource tags for cost allocation
    cdk.Tags.of(this).add('Environment', 'development');
    cdk.Tags.of(this).add('Project', 'notification-system');
    cdk.Tags.of(this).add('Owner', 'platform-team');
    cdk.Tags.of(this).add('CostCenter', 'engineering');

    // Additional stack outputs
    new cdk.CfnOutput(this, 'DashboardUrl', {
      value: `https://${cdk.Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${cdk.Aws.REGION}#dashboards:name=${dashboard.dashboardName}`,
      description: 'CloudWatch dashboard URL for monitoring',
      exportName: `${this.stackName}-DashboardUrl`,
    });

    new cdk.CfnOutput(this, 'ApiKeyId', {
      value: apiKey.keyId,
      description: 'API Gateway API key ID for authentication',
      exportName: `${this.stackName}-ApiKeyId`,
    });

    console.log('Infrastructure stack integration complete with monitoring and logging configured');
  }
}
