import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";
import { Config } from "@serverless-stack/node/config";
import { sign, verify } from "jsonwebtoken";

const sqs = new AWS.SQS();

const {
  entities: { UserEntity, ServiceEntity },
} = mandosModel;

const sendEmailjsSqs = async (email: string, action: "reset" | "sign-up") => {
  await sqs
    .sendMessage({
      QueueUrl: Config.EMAILJS_SQS,
      MessageBody: JSON.stringify({
        email,
        action,
      }),
      MessageGroupId: action,
    })
    .promise()
    .then((e) => console.log("emailjsSqs response:", e));
};

builder.mutationFields((t) => ({
  resetPassword: t.boolean({
    args: {
      signupToken: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { signupToken, password }) => {
      const { email } = verify(signupToken, Config.SIGNUP_TOKEN_SECRET) as {
        email: string;
      };

      const { data: userQuery } = await UserEntity.query.email({ email }).go();
      if (userQuery.length < 1) throw new Error("user not found");
      const [user] = userQuery;

      const hashed = bcrypt.hashSync(password, 8);
      await UserEntity.update({
        userId: user.userId,
        email: user.email,
      })
        .set({ password: hashed })
        .go();

      return true;
    },
  }),

  sendResetEmail: t.boolean({
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, { email }) => {
      const { data: found } = await UserEntity.query.email({ email }).go();
      if (found.length < 1) throw new Error("account does not yet exist");

      const [user] = found;
      if (!user.confirmed) throw new Error("account not confirmed");

      await sendEmailjsSqs(email, "reset");

      return true;
    },
  }),

  resendEmail: t.boolean({
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, { email }) => {
      const { data: found } = await UserEntity.query.email({ email }).go();
      if (found.length < 1) throw new Error("account does not yet exist");

      const [user] = found;
      if (user.confirmed) throw new Error("account already confirmed");

      await sendEmailjsSqs(email, "sign-up");

      return true;
    },
  }),

  // todo: move to queries?
  confirm: t.boolean({
    args: {
      signupToken: t.arg.string({ required: true }),
    },
    resolve: async (_, { signupToken }) => {
      const { email } = verify(signupToken, Config.SIGNUP_TOKEN_SECRET) as {
        email: string;
      };

      const { data: userQuery } = await UserEntity.query.email({ email }).go();
      if (userQuery.length < 1) throw new Error("user not found");
      const [user] = userQuery;

      if (!user.confirmed) {
        await UserEntity.update({
          userId: user.userId,
          email: user.email,
        })
          .set({ confirmed: true })
          .go();
      }

      return true;
    },
  }),

  signUp: t.boolean({
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { email, password }) => {
      const { data: userQuery } = await UserEntity.query.email({ email }).go();

      if (userQuery.length > 0) {
        const [user] = userQuery;
        if (user.confirmed) throw new Error("email registered");
        await UserEntity.delete(user).go();
      }

      const hashed = bcrypt.hashSync(password, 8);
      await UserEntity.create({ email, password: hashed }).go();

      await sendEmailjsSqs(email, "sign-up");

      return true;
    },
  }),

  signIn: t.string({
    args: {
      serviceId: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { serviceId, email, password }) => {
      const { data: serviceQuery } = await ServiceEntity.query
        .service({ serviceId })
        .go();
      if (serviceQuery.length < 1) throw new Error("unknown service");
      const [
        { redirect, accessTokenSecret, refreshTokenSecret },
      ] = serviceQuery;

      const { data: userQuery } = await UserEntity.query.email({ email }).go();
      if (userQuery.length < 1) throw new Error("user not found");
      const [user] = userQuery;

      const compared = bcrypt.compareSync(password, user.password);
      if (!compared) throw new Error("incorrect password");
      if (!user.confirmed) throw new Error("account not confirmed");

      const payload = { email, userId: user.userId, serviceId };
      const accessToken = sign(payload, accessTokenSecret, { expiresIn: "1m" });
      const refreshToken = sign(payload, refreshTokenSecret, {
        expiresIn: "2m",
      });

      return `${redirect}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    },
  }),
}));
