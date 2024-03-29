import {
  Bucket,
  use,
  StackContext,
  ViteStaticSite,
  Queue,
  Config,
} from "@serverless-stack/resources";

import { Api } from "./Api";

const { DOMAIN, REGISTRAR_SUBDOMAIN, ACCOUNT_SUBDOMAIN } = process.env;

export function Web({ stack, app }: StackContext) {
  const api = use(Api);

  //////////////////////////////////////////////////////////////////////////////
  // Registrar Site ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const registrarSite = new ViteStaticSite(stack, "registrar-site", {
    path: "web/registrar-site", // todo: remove 'site' from path name
    buildCommand: "npm run build",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
    customDomain: {
      domainName: `${REGISTRAR_SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${REGISTRAR_SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  const registrationTokenSecret = new Config.Secret(
    stack,
    "REGISTRATION_TOKEN_SECRET"
  );

  if (!registrarSite.customDomainUrl) {
    throw new Error("customDomainUrl not defined");
  }

  // todo: move this or combine all files
  const emailjsSqs = new Queue(stack, "emailjs", {
    consumer: {
      function: {
        handler: "functions/external/emailjs.handler",
        bind: [
          registrationTokenSecret,
          new Config.Parameter(stack, "REGISTRAR_URL", {
            value: registrarSite.customDomainUrl,
          }),
          new Config.Secret(stack, "EMAILJS_USER_ID"),
          new Config.Secret(stack, "EMAILJS_SERVICE_ID"),
          // new Config.Secret(stack, "EMAILJS_ACCESSTOKEN"),
          new Config.Parameter(stack, "EMAILJS_TEMPLATE_ID", {
            value: "template_pwk79e6",
          }),
        ],
        environment: {
          STAGE: app.stage,
        },
      },
    },
    cdk: {
      queue: {
        contentBasedDeduplication: true,
        fifo: true,
      },
    },
  });

  const logoBucket = new Bucket(stack, "logo");
  const avatarBucket = new Bucket(stack, "avatar");

  api.addRoutes(stack, {
    "POST /graphql": {
      type: "pothos",
      function: {
        handler: "functions/graphql/graphql.handler",
        bind: [logoBucket, avatarBucket, emailjsSqs, registrationTokenSecret],
      },
      schema: "services/functions/graphql/schema.ts",
      output: "graphql/schema.graphql",
      commands: [
        "npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm",
      ],
    },
    "POST /user": {
      function: {
        handler: "functions/rest/user.handler",
        bind: [avatarBucket],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  // Account Site //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const accountSite = new ViteStaticSite(stack, "account-site", {
    path: "web/account-site", // todo: remove 'site' from path name
    buildCommand: "npm run build",
    environment: {
      VITE_API_URL: api.url,
      VITE_STAGE: app.stage,
      VITE_REGISTRAR_URL: registrarSite.customDomainUrl,
    },
    customDomain: {
      domainName: `${ACCOUNT_SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${ACCOUNT_SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  stack.addOutputs({
    REGISTRAR_SITE: registrarSite.url,
    ACCOUNT_SITE: accountSite.url,
  });

  return api;
}
