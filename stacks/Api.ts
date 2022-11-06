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
    defaults: {
      function: {
        bind: [db],
      },
    },
    customDomain: {
      domainName: `${REGISTRAR_SUBDOMAIN}-api.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
    routes: {
      "POST /verify": {
        function: {
          handler: "functions/rest/verify.handler",
        },
      },
      "POST /refresh": {
        function: {
          handler: "functions/rest/refresh.handler",
        },
      },
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
