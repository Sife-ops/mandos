import { Function, StackContext } from "@serverless-stack/resources";

export function Automation({ stack }: StackContext) {
  new Function(stack, "service-create", {
    handler: "functions/automation/service-create.handler",
  });
}
