import { GraphQLHandler } from "@serverless-stack/node/graphql";
import { mandosModel } from "@mandos/core/model";
import { schema } from "./schema";
import { schemaPrivate } from "./schema-private";
import { verify, decode } from "jsonwebtoken";

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
    console.log(event);
    const accessToken = event.headers.authorization;

    if (accessToken) {
      const { serviceId } = decode(accessToken) as { serviceId: string };

      const {
        data: serviceQuery,
      } = await mandosModel.entities.ServiceEntity.query
        .service({ serviceId })
        .go();
      // if (serviceQuery.length < 1) throw new Error("unknown service");
      const [service] = serviceQuery;

      verify(accessToken, service.accessTokenSecret);

      return GraphQLHandler({
        schema: schemaPrivate,
      })(event, context);
    } else {
      return GraphQLHandler({
        schema,
      })(event, context);
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 401,
    };
  }
};
