import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
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
  }
}
