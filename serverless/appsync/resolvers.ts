const queriesFolder = "../mappingTemplates/queries";
const mutationsFolder = "../mappingTemplates/mutations";

const resolvers = {
  "Query.getArticle": {
    kind: "UNIT",
    // code: `${queriesFolder}/getArticle.ts`,
    dataSource: "tableArticles",
  },
  "Mutation.postArticle": {
    kind: "UNIT",
    // code: `${mutationsFolder}/postArticle.ts`,
    dataSource: "tableArticles",
  },
};

export default resolvers;
