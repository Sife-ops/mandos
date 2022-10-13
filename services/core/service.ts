import { Dynamo } from "./dynamo";
import { Entity, EntityItem } from "electrodb";

export const ServiceEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Service",
      service: "scratch",
    },
    attributes: {
      serviceId: {
        type: "string",
        required: true,
      },

      redirect: {
        type: "string",
        required: true,
      },

      accessTokenSecret: {
        type: "string",
        required: true,
      },

      refreshTokenSecret: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      service: {
        pk: {
          field: "pk",
          composite: ["serviceId"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  Dynamo.Configuration
);

export type ServiceEntityType = EntityItem<typeof ServiceEntity>;
