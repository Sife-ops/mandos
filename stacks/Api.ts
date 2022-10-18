import {
  StackContext,
  Api as ApiGateway,
  use,
} from "@serverless-stack/resources";

import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  const db = use(Database);

  const { DOMAIN, SUBDOMAIN } = process.env;
  if (!DOMAIN) throw new Error("DOMAIN undefined");
  if (!SUBDOMAIN) throw new Error("SUBDOMAIN undefined");

  const api = new ApiGateway(stack, "api", {
    customDomain: {
      domainName: `${SUBDOMAIN}-api.${DOMAIN}`,
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
