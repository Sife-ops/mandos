import AWS from "aws-sdk";
import { Config } from "@serverless-stack/node/config";
import { ServiceType } from "./service";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";

const s3 = new AWS.S3();

builder.queryFields((t) => ({
  service: t.field({
    type: ServiceType,
    args: {
      serviceId: t.arg.string({ required: true }),
    },
    resolve: async (_, { serviceId }) => {
      const logoUrl = s3.getSignedUrl("getObject", {
        Key: `${serviceId}.png`,
        Bucket: Config.LOGO_BUCKET,
        Expires: 900,
      });

      const { data: services } = await mandosModel.entities.ServiceEntity.query
        .service({
          serviceId,
        })
        .go();
      if (services.length < 1) throw new Error("unknown service");
      const [service] = services;

      return {
        ...service,
        logoUrl,
      };
    },
  }),
}));
