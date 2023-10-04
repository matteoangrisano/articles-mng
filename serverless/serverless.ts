import type { AWS } from "@serverless/typescript";
import "dotenv";
import { config } from "dotenv";
config({ path: `${__dirname}/../../../.env` });
import path from "path";
const folderName = path.basename(path.dirname(path.dirname(__filename)));

import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: `${process.env.PROJECT_NAME}-${folderName}`,
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    // @ts-ignore
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
  },
};

module.exports = serverlessConfiguration;
