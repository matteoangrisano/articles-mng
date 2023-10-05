export const dataSources = {
  tableArticles: {
    type: "AMAZON_DYNAMODB",
    name: "tableArticles",
    description: "tableArticles",
    config: {
      tableName:
        "${cf:cdk-${self:service}-${self:provider.stage}.DynamoDBTableArticles}",
      serviceRoleArn:
        "${cf:cdk-${self:service}-${self:provider.stage}.RoleAppSync}",
    },
  },
};

export default dataSources;
