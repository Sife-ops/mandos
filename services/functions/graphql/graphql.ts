import { GraphQLHandler } from "@serverless-stack/node/graphql";
import { mandosModel } from "@mandos/core/model";
import { parse } from "graphql";
import { schema } from "./schema";
import { verify } from "jsonwebtoken";

export const handler = async (
  event: any,
  context: any
): Promise<
  | {
      statusCode: number;
      body: string;
      headers: {
        [k: string]: string;
      };
    }
  | {
      statusCode: number;
      body?: undefined;
      headers?: undefined;
    }
> => {
  try {
    const parsedJson = JSON.parse(event.body);
    const parsedQuery = parse(parsedJson.query);
    const firstFieldName = firstFieldValueNameFromOperation(
      firstOperationDefinition(parsedQuery)
    );
    const isPrivate = ["user"].includes(firstFieldName);
    const accessToken = event.headers.authorization;

    if (isPrivate) {
      if (!accessToken) {
        throw new Error("no access token");
      }

      const {
        data: [service],
      } = await mandosModel.entities.ServiceEntity.query
        .service({ serviceId: "account" })
        .go();

      verify(accessToken, service.accessTokenSecret);
    }

    return GraphQLHandler({ schema })(event, context);
  } catch (e) {
    console.log(e);

    return {
      statusCode: 401,
      headers: {},
      body: JSON.stringify({ errors: [{ message: "unauthorized" }] }),
    };
  }
};

const firstOperationDefinition = (ast: any) => ast.definitions[0];
const firstFieldValueNameFromOperation = (operationDefinition: any) =>
  operationDefinition.selectionSet.selections[0].name.value;
