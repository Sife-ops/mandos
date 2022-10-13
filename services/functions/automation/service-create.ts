import AWS from "aws-sdk";
import { Config } from "@serverless-stack/node/config";
import { mandosModel } from "@mandos/core/model";

const S3 = new AWS.S3();

// todo: zod
export const handler = async ({
  accessTokenSecret,
  refreshTokenSecret,
  serviceId,
  redirect,
}: {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  serviceId: string;
  redirect: string;
}) => {
  const res = await mandosModel.entities.ServiceEntity.create({
    accessTokenSecret,
    redirect,
    refreshTokenSecret,
    serviceId,
  }).go();
  console.log(res);
};
