import { builder } from "../../builder";
import bcrypt from "bcryptjs";
import { mandosModel } from "@mandos/core/model";
import { UserType } from "../user";
import { Config } from "@serverless-stack/node/config";
import { UserEntityType } from "@mandos/core/user";
import AWS from "aws-sdk";

const S3 = new AWS.S3();

const {
  entities: { UserEntity },
} = mandosModel;

builder.mutationFields((t) => ({
  changeUsername: t.field({
    type: UserType,
    args: {
      username: t.arg.string({ required: true }),
    },
    resolve: (_, args, { user }) => updateAttrs(user, args),
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
    // type: UserType,
    args: {
      avatar: t.arg.string({ required: true }),
    },
    // resolve: (_, args, { user }) => updateAttrs(user, args),
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

const updateAttrs = async (
  user: { userId: string; email: string },
  attrs: Partial<UserEntityType>
) => {
  const res = await UserEntity.update(user)
    .set(attrs)
    .go();
  console.log("update result", res);

  const {
    data: [updated],
  } = await UserEntity.query.user(user).go();

  return {
    ...updated,
    avatarUrl: "",
  };
};
