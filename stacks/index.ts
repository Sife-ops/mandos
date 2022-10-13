import { App } from "@serverless-stack/resources";
import { Api } from "./Api";
import { Automation } from "./Automation";
// import { Web } from "./Web";
import { Database } from "./Database";

export default function main(app: App) {
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
    // .stack(Web);
    .stack(Api);
}
