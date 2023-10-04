import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_cognito as cognito } from "aws-cdk-lib";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";

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

    const roleAppSync = new iam.Role(this, "roleAppSync", {
      roleName: `${projectName}-${stage}-roleAppSync`,
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    });

    const rolePolicyAppSync = new iam.Policy(this, "rolePolicyAppSync", {
      policyName: "rolePolicyAppSync",
      statements: [
        new iam.PolicyStatement({
          sid: `rolePolicyAppSync`,
          resources: ["*"],
          actions: ["*"],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });

    rolePolicyAppSync.attachToRole(roleAppSync);

    const cognitoUserPoolIdReaders = new cognito.UserPool(
      this,
      "cognitoUserPoolIdReaders",
      {
        userPoolName: `${projectName}-${stage}-readers`,
        selfSignUpEnabled: false,
        autoVerify: { email: true },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const cognitoClientReaders = new cognito.UserPoolClient(
      this,
      "cognitoClientReaders",
      {
        userPoolClientName: `${projectName}-${stage}-readers`,
        userPool: cognitoUserPoolIdReaders,
      }
    );

    const dynamoDBTableArticles = new dynamodb.Table(
      this,
      "dynamoDBTableArticles",
      {
        tableName: `${projectName}-${stage}-articles`,
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.NUMBER,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    // OUTPUT

    const CognitoUserPoolIdReaders = new cdk.CfnOutput(
      this,
      "CognitoAdminUserPoolId",
      {
        value: cognitoUserPoolIdReaders.userPoolId,
      }
    );
    CognitoUserPoolIdReaders.overrideLogicalId(`CognitoAdminUserPoolId`);

    const RoleAppSync = new cdk.CfnOutput(this, "RoleAppSync", {
      value: roleAppSync.roleArn,
    });
    RoleAppSync.overrideLogicalId(`RoleAppSync`);

    const DynamoDBTableArticles = new cdk.CfnOutput(
      this,
      "DynamoDBTableTenant",
      {
        value: dynamoDBTableArticles.tableName,
      }
    );
    DynamoDBTableArticles.overrideLogicalId(`DynamoDBTableArticles`);
  }
}
