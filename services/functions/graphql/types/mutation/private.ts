import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { Config } from "@serverless-stack/node/config";
import { builder } from "../../builder";
import { mandosModel } from "@mandos/core/model";

const S3 = new AWS.S3();

const {
  entities: { UserEntity },
} = mandosModel;

builder.mutationFields((t) => ({
  changeUsername: t.boolean({
    args: {
      username: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { user }) => {
      await UserEntity.update(user)
        .set(args)
        .go();

      return true;
    },
  }),

  changePassword: t.boolean({
    args: {
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { password }, { user }) => {
      const hashed = bcrypt.hashSync(password, 8);

      await UserEntity.update(user)
        .set({ password: hashed })
        .go();

      return true;
    },
  }),

  changeAvatar: t.boolean({
    args: {
      avatar: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { user }) => {
      const type = args.avatar.split(";")[0].split("/")[1];
      const buffer = Buffer.from(
        args.avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const resized = await sharp(buffer)
        .resize(128, 128)
        .toBuffer();

      await S3.putObject({
        Bucket: Config.AVATAR_BUCKET,
        Key: user.userId,
        Body: resized,
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      }).promise();

      return true;
    },
  }),
}));
