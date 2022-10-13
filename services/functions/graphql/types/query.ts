import { ServiceType } from "./service";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";

builder.queryFields((t) => ({
  service: t.field({
    type: ServiceType,
    args: {
      serviceId: t.arg.string({ required: true }),
    },
    resolve: (_, { serviceId }) =>
      mandosModel.entities.ServiceEntity.query
        .service({
          serviceId,
        })
        .go()
        .then((e) => {
          if (e.data.length < 1) throw new Error("unknown service");
          return e.data[0];
        }),
  }),
}));
