import * as articlesModule from "./articles/articles";

export const articles = {
  name: "${self:service}-${self:provider.stage}",
  authenticationType: "AMAZON_COGNITO_USER_POOLS",
  additionalAuthenticationProviders: [{ authenticationType: "AWS_IAM" }],
  userPoolConfig: {
    awsRegion: "${opt:region, self:custom.defaultRegion}",
    defaultAction: "ALLOW",
    userPoolId:
      "${cf:cdk-${self:service}-${self:provider.stage}.CognitoUserPoolIdReaders}",
  },
  logConfig: {
    loggingRoleArn:
      "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    level: "ALL",
    excludeVerboseContent: false,
  },
  schema: ["schemas/articles/schema.graphql"],
  mappingTemplatesLocation: "dist/mappingTemplates",
  mappingTemplates: [...articlesModule.mappingTemplates],
  dataSources: [...articlesModule.dataSource],
};
