import { App } from "@serverless-stack/resources";
import { Api } from "./Api";
import { Automation } from "./Automation";
import { Web } from "./Web";
import { Database } from "./Database";
import { SettingsApp } from "./SettingsApp";

const { DOMAIN, SETTINGS_SUBDOMAIN, REGISTRAR_SUBDOMAIN } = process.env;

export default function main(app: App) {
  if (!DOMAIN) throw new Error("DOMAIN undefined");
  if (!SETTINGS_SUBDOMAIN) throw new Error("SETTINGS_SUBDOMAIN undefined");
  if (!REGISTRAR_SUBDOMAIN) throw new Error("REGISTRAR_SUBDOMAIN undefined");

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
    .stack(Web)
    .stack(SettingsApp);
}
