import { ServiceType } from "./service";
import { UserType } from "./user";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";

builder.queryFields((t) => ({
  service: t.field({
    type: ServiceType,
    args: {
      serviceId: t.arg.string({ required: true }),
    },
    resolve: async (_, { serviceId }) => {
      const { data: services } = await mandosModel.entities.ServiceEntity.query
        .service({
          serviceId,
        })
        .go();
      if (services.length < 1) throw new Error("unknown service");
      const [service] = services;
      return service;
    },
  }),

  user: t.field({
    type: UserType,
    resolve: async (_, __, { user: { userId } }) => {
      const {
        data: [user],
      } = await mandosModel.entities.UserEntity.query.user({ userId }).go();
      return user;
    },
  }),
}));
