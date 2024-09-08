TITLE: Curddur - A Real Time The social media application. The users are able to message each other and they have a feed that displays messages that are relevant to them. The frontend of the project has been created with ReactJS-Vite (JavaScript). The backend has been created with Flask (Python).
Tools: [To be filled]
Year: March 2024

# Introduction to Cloud Spend

## Technical Tasks done in AWS

● Discussing the format of the bootcamp
● Going over the business use-case of our project
● Looking at an architectural diagram of what we plan to build
○ Showcase how to use Lucid Charts to build architectures
○ Talk about C4 Models
● Running through the cloud services we will utilize
● Testing that we can access our AWS accounts
● Settings up AWS free-tier and understand how to track spend in AWS
○ eg . AWS Budgets, AWS Cost Explorer, Billing Alarms
● Understanding how to look at monthly billing reports
● Launching AWS CloudShell and looking at AWS CLI
● Generating AWS credentials

## Weekly Outcomes

● Gain confidence when working meter-billing with a Cloud Service Provider (CSP)
● To understand how to build useful architecture diagrams
● To gain a general idea of the cost of common cloud services
● To ensure we have a working AWS account

# Docker and App Containerization

## Technical Tasks done in AWS

● Create a new GitHub repo
● Launch the repo within a Gitpod workspace
● Configure Gitpod.yml configuration, eg. VSCode Extensions
● Clone the frontend and backend repo
● Explore the codebases
● Ensure we can get the apps running locally
● Write a Dockerfile for each app
● Ensure we get the apps running via individual container
● Create a docker-compose file
● Ensure we can orchestrate multiple containers to run side by side
● Mount directories so we can make changes while we code

## Weekly Outcomes

● Gain practical knowledge working with common docker command and running container images for the purpose of local development
● Gain practical knowledge of working within a Cloud Development environment
● Be able to navigate a backend and front web-application and generally understand how they work

# Distribued Tracing

## Technical Tasks done in AWS

● Instrument our backend flask application to use Open Telemetry (OTEL) with Honeycomb.io as the provider
● Run queries to explore traces within Honeycomb.io
● Instrument AWS X-Ray into backend flask application
● Configure and provision X-Ray daemon within docker-compose and send data back to X-Ray API
● Observe X-Ray traces within the AWS Console
● Integrate Rollbar for Error Logging
● Trigger an error an observe an error with Rollbar
● Install WatchTower and write a custom logger to send application log data to CloudWatch Log group

## Weekly Outcomes

● The fractional CTO has suggested that we implement distributed tracing first so because as we begin to add cloud services it will become difficult to pinpoint issue and we want to keep pace with the (probably unrealistic) development timeline

# Decentralized Authenciation

## Technical Tasks done in AWS

● Provision via ClickOps a Amazon Cognito User Pool
● Install and configure Amplify client-side library for Amazon Congito
● Implement API calls to Amazon Coginto for custom login, signup, recovery and forgot password page
● Show conditional elements and data based on logged in or logged out
● Verify JWT Token server side to serve authenticated API endpoints in Flask Application

## Weekly Outcomes

● Practical knowledge of implementing a decentralized authentication service into a web-application with custom login and signup pages in a react application.

# SQL Database

## Technical Tasks done in AWS

● Have a lecture about data modelling in (3rd Normal Form) 3NF for SQL
● Launch Postgres locally via a container
● Seed our Postgres Database table with data
● Write a Postgres adapter
● Write a DDL (for creating schema)
● Write an SQL read query
● Write an SQL write query
● Provision an RDS Postgres instance
● Configure VPC Security Groups
● Configure local backend application to use production connection URL
● Add a caching layer using Momento Serverless Cache
● Propagate metrics from DDB to an RDS metrics table

## Weekly Outcomes

● Be able to data model using 3rd normal forms
● Practical working knowledge of utilizing a Postgres database
● Basic knowledge of working with an Online Analytical Processing (OLAP)

# NoSQL Database

## Technical Tasks done in AWS

● Have a lecture about data modeling (Single Table Design) for NoSQL
● Launch DynamoDB local
● Seed our DynamoDB tables with data using Faker
● Write AWS SDK code for DynamoDB to query and scan put-item, for predefined endpoints
● Create a production DynamoDB table
● Update our backend app to use the production DynamoDB
● Add a caching layer using Momento Severless Cache

## Weekly Outcomes

● Be able to data model using single table design
● Basic knowledge of working with a cloud SDK
● Basic implementation of read-aside cache in front of a database
● Interact with a production NoSQL database
● Basic knowledge of working with an OLTP

# Deploying Serverless Containers and Solving CORS with custom domain and Load Balanacing

## Technical Tasks done in AWS

● Create an Elastic Container Repository (ECR)
● Push our container images to ECR
● Write an ECS Task Definition file for Fargate
● Launch our Fargate services via CLI
● Test that our services individually work
● Play around with Fargate desired capacity
● How to push new updates to your code update Fargate running tasks
● Test that we have a Cross-origin Resource Sharing (CORS) issue
● \*Create a Route53 hosted zone to manage our domain
● Generate a public certificate via AWS Certificate Manager (ACM)
● Create an Application Load Balancer (ALB)
● Create ALB target group that points to our Fargate instances
● Update our application to handle CORS

## Weekly Outcomes

● Being able to push and tag container images to remote repository
● Practical knowledge of deploying, configuring and updating a serverless container
● Basic knowledge of working with a cloud CLI
● Working with DNS records and hosted zones
● Configuring TLS termination at the load balancer
● Deploying and configuring a load balancer for multiple subdomains
● Basic understanding of solving CORS issues and backend-to-frontend communication

# Serverless Image Processing

## Technical Tasks done in AWS

● Test our JavaScript code to use Sharp and process a thumbnail
● Write an AWS Lambda function
● Deploy our Lambda function
● Create an S3 Bucket
● Create an S3 Event Notification to process images upload to S3 and deposit them back in the bucket
● Implement basic file upload to S3 client-side

## Weekly Outcomes

● Basic knowledge of writing, deploying and logging serverless functions
● Basic knowledge of working with serverless object storage
● Basic knowledge of working with event-bus actions

# CI/CD Development

## Technical Tasks done in AWS

● Write a buildspec.yml to build new images from our GitHub repository
● Test AWS CodeBuild is building and tagging our images correctly
● Write an appspec.yml with multiple lambda for steps
● Manually trigger a deploy with CodeDeploy to Fargate
● Create a CodePipeline that will trigger CodeBuild and CodeDeploy when code changes are pushed to our GitHub repository

## Weekly Outcomes

● Configuring and running a build server to bake container images and push to private repo
● Configure deployment controller for server containers
● Implement Continuous Deployment for backend and frontend applications

# Cloud Formation

## Technical Tasks done in AWS

● Write a CFN template for our Cluster and Load Balancer
● Deploy CFN template
● Update CFN template
● Write a CFN template for our CI/CD pipeline
● Implement Cross-reference stack implementation
● Deploy CFN template
● Update CFN template

## Weekly Outcomes

● Write Declarative Infrastructure as Code for a three-tier architecture
● Deploy infrastructure via IaC service that manages the remote state
● Write Declarative Infrastructure as Code for a CI/CD pipeline

# Modern APIs

## Technical Tasks done in AWS

● Implement Realtime Pub/Sub APIs
● Implementing WebSockets for front-end react application
● Custom Resolver for Lambda Authorizator with AuthN
● Use the Amplify Libraries for AppSync
● Design GraphQL Schema
● Custom Domain with AppSync

## Weekly Outcomes Modern APIs
