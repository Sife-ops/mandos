import AWS from "aws-sdk";
import { Bucket } from "@serverless-stack/node/bucket";
import { ServiceType } from "./service";
import { UserType } from "./user";
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
      // todo: use below pattern
      const logoUrl = s3.getSignedUrl("getObject", {
        Key: `${serviceId}.png`,
        Bucket: Bucket.logo.bucketName,
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

  user: t.field({
    type: UserType,
    resolve: async (_, __, { user: { userId } }) => {
      const {
        data: [user],
      } = await mandosModel.entities.UserEntity.query.user({ userId }).go();

      let avatarUrl: string = "";
      try {
        const params = {
          Key: userId,
          Bucket: Bucket.avatar.bucketName,
        };

        await s3.headObject(params).promise();
        avatarUrl = s3.getSignedUrl("getObject", { ...params, Expires: 900 });
      } catch {
        console.log("avatar unavailable");
      }

      return {
        ...user,
        avatarUrl,
      };
    },
  }),
}));
