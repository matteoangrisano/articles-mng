import mappingTemplates from "./mappingTemplates";
import dataSources from "./dataSources";

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
  resolvers: [...mappingTemplates],
  dataSources: [...dataSources],
};

export default appsyncConfig;
