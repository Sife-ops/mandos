import { Database } from "./Database";
import { Function, StackContext, use } from "@serverless-stack/resources";

export function Automation({ stack }: StackContext) {
  const db = use(Database);

  new Function(stack, "service-create", {
    handler: "functions/automation/service-create.handler",
    config: [db.TABLE_NAME],
    permissions: [db.table],
  });
}
