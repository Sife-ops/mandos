import {
  StackContext,
  use,
  Api as ApiGateway,
  Bucket,
  Config,
} from "@serverless-stack/resources";
import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  const db = use(Database);

  const logoBucket = new Bucket(stack, "logo");

  const api = new ApiGateway(stack, "api", {
    defaults: {
      function: {
        permissions: [db.table, logoBucket],
        config: [
          db.TABLE_NAME,
          new Config.Parameter(stack, "LOGO_BUCKET", {
            value: logoBucket.bucketName,
          }),
        ],
      },
    },
    routes: {
      "POST /graphql": {
        type: "pothos",
        function: {
          handler: "functions/graphql/graphql.handler",
        },
        schema: "services/functions/graphql/schema.ts",
        output: "graphql/schema.graphql",
        commands: [
          "npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm",
        ],
      },
    },
  });

  new Config.Parameter(stack, "API_URL", {
    value: api.url,
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
