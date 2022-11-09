import AWS from "aws-sdk";
import { Bucket } from "@serverless-stack/node/bucket";
import { ServiceEntityType } from "@mandos/core/service";
import { builder } from "../builder";

const s3 = new AWS.S3();

export const ServiceType = builder.objectRef<ServiceEntityType>("Service");
ServiceType.implement({
  fields: (t) => ({
    serviceId: t.exposeID("serviceId"),
    title: t.exposeString("title"),
    redirect: t.exposeString("redirect"),

    logoUrl: t.string({
      resolve: async ({ serviceId }) =>
        s3.getSignedUrl("getObject", {
          Key: `${serviceId}.png`,
          Bucket: Bucket.logo.bucketName,
          Expires: 900,
        }),
    }),
  }),
});
