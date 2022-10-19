import { App } from "@serverless-stack/resources";
import { Api } from "./Api";
import { Automation } from "./Automation";
import { Web } from "./Web";
import { Database } from "./Database";

const { DOMAIN, SUBDOMAIN } = process.env;

export default function main(app: App) {
  if (!DOMAIN) throw new Error("DOMAIN undefined");
  if (!SUBDOMAIN) throw new Error("SUBDOMAIN undefined");

  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app
    .stack(Database)
    .stack(Automation)
    .stack(Api)
    .stack(Web);
}
