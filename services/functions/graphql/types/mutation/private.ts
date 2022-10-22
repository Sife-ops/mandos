import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import { Config } from "@serverless-stack/node/config";
import { builder } from "../../builder";
import { faker } from "@faker-js/faker";
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
      const { data: usernameQuery } = await UserEntity.query
        .username({ username })
        .go();

      let discriminator = "0000";
      if (usernameQuery.length >= 10000) {
        throw new Error("username unavailable");
      } else if (usernameQuery.length > 0) {
        while (true) {
          if (!usernameQuery.find((e) => e.discriminator === discriminator)) {
            break;
          }
          discriminator = faker.datatype
            .number({ min: 10001, max: 19999 })
            .toString()
            .slice(1);
        }
      }

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
        Bucket: Config.AVATAR_BUCKET,
        Key: user.userId,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      }).promise();

      return true;
    },
  }),
}));
