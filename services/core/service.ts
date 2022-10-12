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
      url: {
        type: "string",
        required: true,
      },

      redirect: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      url: {
        pk: {
          field: "pk",
          composite: ["url"],
        },
        sk: {
          field: "sk",
          composite: ["redirect"],
        },
      },
    },
  },
  Dynamo.Configuration
);

export type ServiceEntityType = EntityItem<typeof ServiceEntity>;
