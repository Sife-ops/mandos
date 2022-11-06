import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import { Bucket } from "@serverless-stack/node/bucket";
import { builder } from "../../builder";
import { getDiscriminator } from "./helper";
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
    resolve: async (_, { username }, { user }) => {
      const { data: usersWithSameUsername } = await UserEntity.query
        .username({ username })
        .go();

      const discriminator = getDiscriminator(usersWithSameUsername);

      await UserEntity.update(user)
        .set({
          username,
          discriminator,
        })
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

      await S3.putObject({
        Bucket: Bucket.avatar.bucketName,
        Key: user.userId,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      }).promise();

      return true;
    },
  }),
}));
