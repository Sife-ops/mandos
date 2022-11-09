import AWS from "aws-sdk";
import { Bucket } from "@serverless-stack/node/bucket";
import { UserEntityType } from "@mandos/core/user";
import { builder } from "../builder";

const s3 = new AWS.S3();

export const UserType = builder.objectRef<UserEntityType>("User");
UserType.implement({
  fields: (t) => ({
    userId: t.exposeID("userId"),
    email: t.exposeString("email"),
    username: t.exposeString("username"),
    discriminator: t.exposeString("discriminator"),
    confirmed: t.exposeBoolean("confirmed"),

    avatarUrl: t.string({
      resolve: async ({ userId }) => {
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
        return avatarUrl;
      },
    }),
  }),
});
