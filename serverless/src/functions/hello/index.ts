import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.call`,
  environment: {
    REGION: process.env.REGION,
    DOMAIN: process.env.DOMAIN,
  },
};
