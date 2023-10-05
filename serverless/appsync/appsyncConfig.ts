import * as articlesModule from "./apiConfig";

const appsyncConfig = {
  name: "${self:service}-${self:provider.stage}",
  authentication: {
    type: "AMAZON_COGNITO_USER_POOLS",
    config: {
      awsRegion: "${opt:region, self:custom.defaultRegion}",
      defaultAction: "ALLOW",
      userPoolId:
        "${cf:cdk-${self:service}-${self:provider.stage}.CognitoUserPoolIdReaders}",
    },
  },
  logging: {
    loggingRoleArn:
      "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    level: "ALL",
    excludeVerboseContent: false,
  },
  schema: ["schemas/articles/schema.graphql"],
  mappingTemplates: [...articlesModule.mappingTemplates],
  dataSources: [...articlesModule.dataSource],
};

export default appsyncConfig;
