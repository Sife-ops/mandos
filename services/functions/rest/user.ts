import AWS from "aws-sdk";
import { Config } from "@serverless-stack/node/config";
import { mandosModel } from "@mandos/core/model";
import { z } from "zod";

const s3 = new AWS.S3();

const eventSchema = z.object({
  userId: z.string(),
});

// todo: duplicated - move rest operations to graphql or function
export const handler = async (event: any) => {
  try {
    const { userId } = eventSchema.parse(JSON.parse(event.body));

    const {
      data: [user],
    } = await mandosModel.entities.UserEntity.query.user({ userId }).go();

    let avatarUrl: string = "";
    try {
      const params = {
        Key: userId,
        Bucket: Config.AVATAR_BUCKET,
      };

      await s3.headObject(params).promise();
      avatarUrl = s3.getSignedUrl("getObject", { ...params, Expires: 900 });
    } catch {
      console.log("avatar unavailable");
    }

    return {
      success: true,
      user: {
        ...user,
        avatarUrl,
        password: "",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e,
    };
  }
};
