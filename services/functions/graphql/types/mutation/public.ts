import AWS from "aws-sdk";
import axios from "axios";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { Config } from "@serverless-stack/node/config";
import { builder } from "../../builder";
import { tokenOptions } from "../../../constant";
import { mandosModel } from "@mandos/core/model";
import { sign, verify } from "jsonwebtoken";

const {
  entities: { UserEntity, ServiceEntity },
} = mandosModel;

const sqs = new AWS.SQS();

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

const CaptchaGetType = builder.objectRef<{
  captcha: string;
  uuid: string;
  ts: string;
}>("CaptchaGet");
CaptchaGetType.implement({
  fields: (t) => ({
    captcha: t.exposeString("captcha"),
    uuid: t.exposeString("uuid"),
    ts: t.exposeString("ts"),
  }),
});

const CaptchaVerifyType = builder.objectRef<{
  message: string;
  ts: string;
}>("CaptchaVerify");
CaptchaVerifyType.implement({
  fields: (t) => ({
    message: t.exposeString("message"),
    ts: t.exposeString("ts"),
  }),
});

const captchaApi = "https://captcha-api.akshit.me/v2";

builder.mutationFields((t) => ({
  captchaGet: t.field({
    type: CaptchaGetType,
    resolve: () => axios.get(`${captchaApi}/generate`).then((e) => e.data),
  }),

  captchaVerify: t.field({
    type: CaptchaVerifyType,
    args: {
      uuid: t.arg.string({ required: true }),
      captcha: t.arg.string({ required: true }),
    },
    resolve: (_, { captcha, uuid }) =>
      axios.post(`${captchaApi}/verify`, { captcha, uuid }).then((e) => e.data),
  }),

  resetPassword: t.boolean({
    args: {
      registrationToken: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { registrationToken, password }) => {
      const { email } = verify(
        registrationToken,
        Config.REGISTRATION_TOKEN_SECRET
      ) as {
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
      registrationToken: t.arg.string({ required: true }),
    },
    resolve: async (_, { registrationToken }) => {
      const { email } = verify(
        registrationToken,
        Config.REGISTRATION_TOKEN_SECRET
      ) as {
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
      username: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { email, username, password }) => {
      const { data: emailQuery } = await UserEntity.query.email({ email }).go();

      if (emailQuery.length > 0) {
        const [user] = emailQuery;
        if (user.confirmed) throw new Error("e-mail already in use");
        await UserEntity.delete(user).go();
      }

      const { data: usernameQuery } = await UserEntity.query
        .username({ username })
        .go();

      // todo: user '0000' if available
      let discriminator = "0000";
      if (usernameQuery.length >= 10000) {
        throw new Error("username unavailable");
      } else if (usernameQuery.length > 0) {
        while (true) {
          discriminator = faker.datatype
            .number({ min: 10001, max: 19999 })
            .toString()
            .slice(1);

          if (!usernameQuery.find((e) => e.discriminator === discriminator)) {
            break;
          }
        }
      }

      const hashed = bcrypt.hashSync(password, 8);
      await UserEntity.create({
        email,
        username,
        discriminator,
        password: hashed,
      }).go();

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
      const accessToken = sign(
        payload,
        accessTokenSecret,
        tokenOptions.accessToken
      );
      const refreshToken = sign(
        payload,
        refreshTokenSecret,
        tokenOptions.refreshToken
      );

      return `${redirect}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    },
  }),
}));
