import * as articlesModule from "./articles/articles";

export const articles = {
  name: "${self:custom.serviceNameShort}-${self:provider.stage}-fleet-admin",
  authenticationType: "AMAZON_COGNITO_USER_POOLS",
  additionalAuthenticationProviders: [
    { authenticationType: "AWS_IAM" },
    { authenticationType: "API_KEY" },
  ],
  userPoolConfig: {
    awsRegion: "${opt:region, self:custom.defaultRegion}",
    defaultAction: "ALLOW",
    userPoolId:
      "${cf:cdk-${self:service}-${self:provider.stage}.CognitoAdminUserPoolId}",
  },
  logConfig: {
    loggingRoleArn:
      "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSyncLogs}",
    level: "ALL",
    excludeVerboseContent: false,
  },
  schema: ["schemas/articles/schema.graphql"],
  mappingTemplatesLocation: "dist/mappingTemplates",
  mappingTemplates: [...articlesModule.mappingTemplates],
  dataSources: [...articlesModule.dataSource],
  substitutions: { ...articlesModule.substitutions },
};
