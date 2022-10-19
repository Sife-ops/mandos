import {
  StackContext,
  Api as ApiGateway,
  use,
} from "@serverless-stack/resources";

import { Database } from "./Database";

  const { DOMAIN, REGISTRAR_SUBDOMAIN } = process.env;

export function Api({ stack }: StackContext) {
  const db = use(Database);

  const api = new ApiGateway(stack, "api", {
    customDomain: {
      domainName: `${REGISTRAR_SUBDOMAIN}-api.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
    routes: {
      "POST /verify": {
        function: {
          handler: "functions/rest/verify.handler",
          config: [db.TABLE_NAME],
          permissions: [db.table],
        },
      },
      "POST /refresh": {
        function: {
          handler: "functions/rest/refresh.handler",
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
