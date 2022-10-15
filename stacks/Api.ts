import { StackContext, Api as ApiGateway } from "@serverless-stack/resources";

export function Api({ stack }: StackContext) {
  const api = new ApiGateway(stack, "api");

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
