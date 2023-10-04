import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_cognito as cognito } from "aws-cdk-lib";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { aws_logs as logs } from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { aws_lambda_nodejs as node } from "aws-cdk-lib";
import * as path from "path";

const service = "radix-lib-template";

export class Infrastructure extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    accountID: string,
    projectName: string,
    stage: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const cognitoUserPoolIdAdmin = new cognito.UserPool(this, "AdminUserPool", {
      userPoolName: `${projectName}-${stage}-admin`,
      selfSignUpEnabled: false,
      autoVerify: { email: true },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        otp: true,
        sms: false,
      },
      passwordPolicy: {
        minLength: 10,
        requireLowercase: false,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: false,
        tempPasswordValidity: cdk.Duration.days(365),
      },
    });

    const cognitoUserPoolClient = cognitoUserPoolIdAdmin.addClient(
      "adminUserPoolClient",
      {
        userPoolClientName: `${projectName}-${stage}-admin-client`,
      }
    );

    const dynamoDBTableTenant = new dynamodb.Table(
      this,
      "dynamoDBTableTenant",
      {
        tableName: `${projectName}-${stage}-tenant`,
        partitionKey: { name: "tenant", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const cdkLambdaMatteo = new node.NodejsFunction(this, "cdkLambdaMatteo", {
      functionName: `${projectName}-${service}-${stage}-cdkLambdaMatteo`,
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../functions/lambdaLib.ts`),
      handler: "handler",
      depsLockFilePath: "yarn.lock",
      environment: {
        tableName: dynamoDBTableTenant.tableName,
        tableArn: dynamoDBTableTenant.tableArn,
      },
    });

    dynamoDBTableTenant.addGlobalSecondaryIndex({
      indexName: "byTenantName",
      partitionKey: {
        name: "tenantName",
        type: dynamodb.AttributeType.STRING,
      },
    });

    dynamoDBTableTenant.addGlobalSecondaryIndex({
      indexName: "byDomain",
      partitionKey: {
        name: "domain",
        type: dynamodb.AttributeType.STRING,
      },
    });

    dynamoDBTableTenant.addGlobalSecondaryIndex({
      indexName: "byTenancyCode",
      partitionKey: {
        name: "tenantCode",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const dynamoDBTableUserGroup = new dynamodb.Table(
      this,
      "dynamoDBTableUserGroup",
      {
        tableName: `${projectName}-${stage}-user-group`,
        partitionKey: { name: "tenant", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "group", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const dynamoDBTableTenantAndGroup = new dynamodb.Table(
      this,
      "dynamoDBTableTenantAndGroup",
      {
        tableName: `${projectName}-${stage}-tenant-and-group`,
        partitionKey: {
          name: "tenant-and-group",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "sub", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    dynamoDBTableTenantAndGroup.addGlobalSecondaryIndex({
      indexName: "byTenant",
      partitionKey: {
        name: "tenant",
        type: dynamodb.AttributeType.STRING,
      },
    });

    dynamoDBTableTenantAndGroup.addGlobalSecondaryIndex({
      indexName: "byTenantAndSub",
      partitionKey: {
        name: "tenant",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "sub", type: dynamodb.AttributeType.STRING },
    });

    const dynamoDBTablePermission = new dynamodb.Table(
      this,
      "dynamoDBTablePermission",
      {
        tableName: `${projectName}-${stage}-permission`,
        partitionKey: {
          name: "tenant",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "group", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const dynamoDBTableUserProfile = new dynamodb.Table(
      this,
      "dynamoDBTableUserProfile",
      {
        tableName: `${projectName}-${stage}-user-profile`,
        partitionKey: {
          name: "tenant",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "sub", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const logGroupStepFunctions = new logs.LogGroup(
      this,
      "logGroupStepFunctions",
      {
        logGroupName: `${projectName}-${stage}-logGroupStepFunctions`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const roleAppSync = new iam.Role(this, "roleAppSync", {
      roleName: `${projectName}-${stage}-roleAppSync`,
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    });

    const rolePolicyAppSyncDynamoDB = new iam.Policy(
      this,
      "rolePolicyAppSyncDynamoDB",
      {
        policyName: "rolePolicyAppSyncDynamoDB",
        statements: [
          new iam.PolicyStatement({
            sid: `rolePolicyAppSyncDynamoDB`,
            resources: ["*"],
            actions: ["dynamodb:*"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );

    rolePolicyAppSyncDynamoDB.attachToRole(roleAppSync);

    const rolePolicyAppSyncStates = new iam.Policy(
      this,
      "rolePolicyAppSyncStates",
      {
        policyName: "rolePolicyAppSyncStates",
        statements: [
          new iam.PolicyStatement({
            sid: `rolePolicyAppSyncStates`,
            resources: ["*"],
            actions: ["states:*"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );

    rolePolicyAppSyncStates.attachToRole(roleAppSync);

    const roleAppSyncLogs = new iam.Role(this, "roleAppSyncLogs", {
      roleName: `${projectName}-${stage}-roleAppSyncLogs`,
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    });

    const rolePolicyAppSyncLogs = new iam.Policy(
      this,
      "rolePolicyAppSyncLogs",
      {
        policyName: "rolePolicyAppSyncLogs",
        statements: [
          new iam.PolicyStatement({
            sid: `rolePolicyAppSyncLogs`,
            resources: ["*"],
            actions: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }
    );

    rolePolicyAppSyncLogs.attachToRole(roleAppSyncLogs);

    const s3BucketConfigs = new s3.Bucket(this, "s3BucketConfigs", {
      bucketName: `${accountID}-${projectName}-${stage}-configs`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
    });

    // OUTPUT

    const CognitoAdminUserPoolId = new cdk.CfnOutput(
      this,
      "CognitoAdminUserPoolId",
      {
        value: cognitoUserPoolIdAdmin.userPoolArn,
      }
    );
    CognitoAdminUserPoolId.overrideLogicalId(`CognitoAdminUserPoolId`);

    const DynamoDBTableTenant = new cdk.CfnOutput(this, "DynamoDBTableTenant", {
      value: dynamoDBTableTenant.tableArn,
    });
    DynamoDBTableTenant.overrideLogicalId(`DynamoDBTableTenant`);

    const DynamoDBTableUserGroup = new cdk.CfnOutput(
      this,
      "DynamoDBTableUserGroup",
      {
        value: dynamoDBTableUserGroup.tableArn,
      }
    );
    DynamoDBTableUserGroup.overrideLogicalId(`DynamoDBTableUserGroup`);

    const DynamoDBTableTenantAndGroup = new cdk.CfnOutput(
      this,
      "DynamoDBTableTenantAndGroup",
      {
        value: dynamoDBTableTenantAndGroup.tableArn,
      }
    );
    DynamoDBTableTenantAndGroup.overrideLogicalId(
      `DynamoDBTableTenantAndGroup`
    );

    const DynamoDBTablePermission = new cdk.CfnOutput(
      this,
      "DynamoDBTablePermiission",
      {
        value: dynamoDBTablePermission.tableArn,
      }
    );
    DynamoDBTablePermission.overrideLogicalId(`DynamoDBTablePermission`);

    const DynamoDBTableUserProfile = new cdk.CfnOutput(
      this,
      "DynamoDBTableUserProfile",
      {
        value: dynamoDBTableUserProfile.tableArn,
      }
    );
    DynamoDBTableUserProfile.overrideLogicalId(`DynamoDBTableUserProfile`);

    const LogGroupStepFunctions = new cdk.CfnOutput(
      this,
      "LogGroupStepFunctions",
      {
        value: cdk.Fn.select(
          0,
          cdk.Fn.split(":*", logGroupStepFunctions.logGroupArn)
        ),
      }
    );
    LogGroupStepFunctions.overrideLogicalId(`LogGroupStepFunctions`);

    const RoleAppSync = new cdk.CfnOutput(this, "RoleAppSync", {
      value: roleAppSync.roleArn,
    });
    RoleAppSync.overrideLogicalId(`RoleAppSync`);

    const RoleAppSyncLogs = new cdk.CfnOutput(this, "RoleAppSyncLogs", {
      value: roleAppSyncLogs.roleArn,
    });
    RoleAppSyncLogs.overrideLogicalId(`RoleAppSyncLogs`);

    const S3BucketConfigs = new cdk.CfnOutput(this, "S3BucketConfigs", {
      value: s3BucketConfigs.bucketArn,
    });
    S3BucketConfigs.overrideLogicalId(`S3BucketConfigs`);
  }
}
