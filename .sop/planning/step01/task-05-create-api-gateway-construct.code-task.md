# Task: Create API Gateway Construct

## Description
Implement a CDK construct for API Gateway that provides the HTTP interface for notification submission, routing POST requests to the Lambda function with appropriate configuration.

## Background
API Gateway serves as the entry point for external clients, providing a managed API layer that handles request routing, validation, and integration with the Lambda function. It enables the standardized HTTP API interface required by the design.

## Reference Documentation
**Required:**
- Design: design/detailed-design.md

**Note:** You MUST read the detailed design document before beginning implementation. Read additional references as needed for context.

## Technical Requirements
1. Define REST API with proper naming and description
2. Create /message resource with POST method
3. Set up Lambda proxy integration with the handler function
4. Configure CORS headers for cross-origin requests
5. Add basic request validation for content-type and body
6. Set up API key and usage plan for rate limiting
7. Configure deployment stage with appropriate settings
8. Export API endpoint URL for client integration

## Dependencies
- AWS CDK core and API Gateway construct libraries
- Completed Lambda function construct
- Understanding of API Gateway integration patterns

## Implementation Approach
1. Import API Gateway constructs from AWS CDK
2. Define REST API with basic configuration
3. Create API resource and method with Lambda integration
4. Configure CORS and request validation
5. Set up usage plans and throttling
6. Create deployment and stage configuration
7. Export API endpoint for external access

## Acceptance Criteria

1. **API Definition**
   - Given CDK construct code
   - When synthesized
   - Then CloudFormation template contains API Gateway REST API resource

2. **Route Configuration**
   - Given API construct
   - When checking resources
   - Then POST /message method is defined with Lambda integration

3. **CORS Setup**
   - Given API configuration
   - When checking method responses
   - Then CORS headers are configured for all origins

4. **Lambda Integration**
   - Given API method
   - When examining integration
   - Then Lambda proxy integration is properly configured

5. **Deployment Stage**
   - Given API construct
   - When deployed
   - Then deployment stage is created with accessible endpoint

## Metadata
- **Complexity**: Medium
- **Labels**: AWS, API Gateway, CDK, API, Infrastructure
- **Required Skills**: AWS CDK, API Gateway, REST APIs, HTTP Integration
