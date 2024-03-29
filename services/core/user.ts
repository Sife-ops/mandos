import { Dynamo } from "./dynamo";
import { Entity, EntityItem } from "electrodb";
import { ulid } from "ulid";

export const UserEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "User",
      service: "mandos",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
        default: () => ulid(),
      },

      email: {
        type: "string",
        required: true,
      },

      username: {
        type: "string",
        required: true,
      },

      discriminator: {
        type: "string",
        required: true,
      },

      password: {
        type: "string",
        required: true,
      },

      confirmed: {
        type: "boolean",
        required: true,
        default: () => false,
      },
    },
    indexes: {
      user: {
        // collection: "user",
        pk: {
          field: "pk",
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          // todo: remove email rangekey
          composite: ["email"],
        },
      },

      email: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["email"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["userId"],
        },
      },

      username: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["username"],
        },
        sk: {
          field: "gsi2sk",
          composite: ["discriminator"],
        },
      },
    },
  },
  Dynamo.Configuration
);

export type UserEntityType = EntityItem<typeof UserEntity>;
