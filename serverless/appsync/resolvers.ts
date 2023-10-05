const queriesFolder = "../mappingTemplates/queries";
const mutationsFolder = "../mappingTemplates/mutations";

const resolvers = {
  "Query.getArticle": {
    code: `${queriesFolder}/getArticle.ts`,
    dataSource: "tableArticles",
  },
  "Mutation.postArticle": {
    code: `${mutationsFolder}/postArticle.ts`,
    dataSource: "tableArticles",
  },
};

export default resolvers;
