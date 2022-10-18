import { use, StackContext, ViteStaticSite } from "@serverless-stack/resources";
import { Api } from "./Api";

const { DOMAIN, SETTINGS_SUBDOMAIN } = process.env;

export function SettingsApp({ stack, app }: StackContext) {
  const api = use(Api);

  const site = new ViteStaticSite(stack, "settings-app", {
    path: "settings-app",
    buildCommand: "npm run build",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
    customDomain: {
      domainName: `${SETTINGS_SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${SETTINGS_SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  stack.addOutputs({
    SETTINGS_APP: site.url,
  });

  return api;
}
