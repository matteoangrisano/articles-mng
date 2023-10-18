import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.call`,
  environment: {
    REGION: "${ENV:REGION}",
  },
};
