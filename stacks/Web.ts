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

const { DOMAIN, SUBDOMAIN } = process.env;

export function Web({ stack, app }: StackContext) {
  const api = use(Api);
  const db = use(Database);

  const site = new ViteStaticSite(stack, "site", {
    path: "web",
    buildCommand: "npm run build",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
    customDomain: {
      domainName: `${SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  // todo: rename to 'registration token'
  const registrationTokenSecret = new Config.Secret(
    stack,
    "REGISTRATION_TOKEN_SECRET"
  );

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
          new Config.Parameter(stack, "SITE_URL", { value: site.url }),
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

  api.addRoutes(stack, {
    "POST /graphql": {
      type: "pothos",
      function: {
        handler: "functions/graphql/graphql.handler",
        permissions: [db.table, logoBucket, emailjsSqs],
        config: [
          db.TABLE_NAME,
          registrationTokenSecret,
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

  stack.addOutputs({
    SITE: site.url,
  });

  return api;
}
