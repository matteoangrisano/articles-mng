const queriesFolder = "mappingTemplates/queries";
const mutationsFolder = "mappingTemplates/mutations";

const resolvers = {
  "Query.getArticle": {
    kind: "UNIT",
    code: `${queriesFolder}/getArticle.js`,
    dataSource: "tableArticles",
  },
  "Mutation.postArticle": {
    kind: "UNIT",
    code: `${mutationsFolder}/postArticle.js`,
    dataSource: "tableArticles",
  },
};

export default resolvers;
