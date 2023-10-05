const queriesFolder = "mappingTemplates/queries";
const mutationsFolder = "mappingTemplates/mutations";

const resolvers = {
  "Query.getArticle": {
    functions: [
      {
        dataSource: "tableArticles",
        code: `${queriesFolder}/getArticle.ts`,
      },
    ],
  },
  "Mutation.postArticle": {
    functions: [
      {
        dataSource: "tableArticles",
        code: `${mutationsFolder}/postArticle.ts`,
      },
    ],
  },
};

export default resolvers;
