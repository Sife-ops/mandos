import {
  StackContext,
  Api as ApiGateway,
  use,
} from "@serverless-stack/resources";

import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  const db = use(Database);

  const api = new ApiGateway(stack, "api", {
    routes: {
      "POST /verify": {
        function: {
          handler: "functions/rest/verify.handler",
          config: [db.TABLE_NAME],
          permissions: [db.table],
        },
      },
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
