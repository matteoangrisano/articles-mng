const mappingTemplatesPath = "articles";

export const mappingTemplates = [
  {
    field: "getArticle",
    type: "Query",
    code: `${mappingTemplatesPath}/Query.getArticle.ts`,
    dataSource: "tableArticles",
  },
];

export const dataSource = [
  {
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
];

export const substitutions = {};
