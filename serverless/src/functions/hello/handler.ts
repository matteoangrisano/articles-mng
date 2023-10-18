import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import "dotenv";
import { config } from "dotenv";
config({ path: `${__dirname}/../../../../../.env` });

import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log(process.env.FOO);
};

export const main = middyfy(hello);
