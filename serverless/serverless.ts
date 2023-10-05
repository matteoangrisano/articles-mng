import type { AWS } from "@serverless/typescript";
import appsync from "appsync";
import "dotenv";
import { config } from "dotenv";
config({ path: `${__dirname}/../../../.env` });
import path from "path";

import hello from "@functions/hello";

const projectName = "article-mng";
const folderName = path.basename(path.dirname(path.dirname(__filename)));
const defaultStage = "dev";
const defaultRegion = "eu-west-1";

const serverlessConfiguration: AWS = {
  service: `${projectName}-${folderName}`,
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-webpack",
    "serverless-appsync-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    stage: "${opt:stage, self:custom.defaultStage}",
    region: process.env.REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },

    appSync: appsync,
    projectName: projectName,
    folderName: folderName,
    defaultStage: defaultStage,
    defaultRegion: defaultRegion,
  },
} as any;

module.exports = serverlessConfiguration;
