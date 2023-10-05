const queriesFolder = "mappingTemplates/queries";
const mutationsFolder = "mappingTemplates/mutations";

const resolvers = {
  "Query.getArticle": {
    kind: "UNIT",
    code: `${queriesFolder}/getArticle.js`,
    request: false,
    response: false,
    dataSource: "tableArticles",
  },
  "Mutation.postArticle": {
    kind: "UNIT",
    code: `${mutationsFolder}/postArticle.js`,
    request: false,
    response: false,
    dataSource: "tableArticles",
  },
};

export default resolvers;
