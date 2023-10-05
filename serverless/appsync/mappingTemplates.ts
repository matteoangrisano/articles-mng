const queriesFolder = "../mappingTemplates/queries";
const mutationsFolder = "../mappingTemplates/mutations";

const mappingTemplates = [
  {
    field: "getArticle",
    type: "Query",
    code: `${queriesFolder}/getArticle.ts`,
    dataSource: "tableArticles",
  },
  {
    field: "postArticle",
    type: "Mutation",
    code: `${mutationsFolder}/postArticle.ts`,
    dataSource: "tableArticles",
  },
];

export default mappingTemplates;
