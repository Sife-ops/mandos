import {
  Bucket,
  use,
  StackContext,
  ViteStaticSite,
  Queue,
  Config,
} from "@serverless-stack/resources";

import { Api } from "./Api";
import { Database } from "./Database";

const { DOMAIN, REGISTRAR_SUBDOMAIN, ACCOUNT_SUBDOMAIN } = process.env;

export function Web({ stack, app }: StackContext) {
  const api = use(Api);
  const db = use(Database);

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
        config: [
          db.TABLE_NAME,
          registrationTokenSecret,
          new Config.Secret(stack, "EMAILJS_USER_ID"),
          new Config.Secret(stack, "EMAILJS_SERVICE_ID"),
          // new Config.Secret(stack, "EMAILJS_ACCESSTOKEN"),
          new Config.Parameter(stack, "EMAILJS_TEMPLATE_ID", {
            value: "template_pwk79e6",
          }),
          new Config.Parameter(stack, "SITE_URL", {
            value: registrarSite.customDomainUrl,
          }),
        ],
        permissions: [db.table],
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
        permissions: [db.table, logoBucket, emailjsSqs, avatarBucket],
        config: [
          db.TABLE_NAME,
          registrationTokenSecret,
          new Config.Parameter(stack, "AVATAR_BUCKET", {
            value: avatarBucket.bucketName,
          }),
          new Config.Parameter(stack, "LOGO_BUCKET", {
            value: logoBucket.bucketName,
          }),
          new Config.Parameter(stack, "EMAILJS_SQS", {
            value: emailjsSqs.queueUrl,
          }),
        ],
      },
      schema: "services/functions/graphql/schema.ts",
      output: "graphql/schema.graphql",
      commands: [
        "npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm",
      ],
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
