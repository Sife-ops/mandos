import bcrypt from "bcryptjs";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";
import { sign } from "jsonwebtoken";

const {
  entities: { UserEntity, ServiceEntity },
} = mandosModel;

builder.mutationFields((t) => ({
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
        // throw new Error("An account with that e-mail address already exists.");
        await UserEntity.delete(user).go();
      }

      const hashed = bcrypt.hashSync(password, 8);

      await UserEntity.create({ email, password: hashed }).go();

      // await sendEmailjsSqs(email, "sign-up");

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
      if (!user.confirmed) throw new Error("user not confirmed");

      const payload = { email, userId: user.userId, serviceId };
      const accessToken = sign(payload, accessTokenSecret, { expiresIn: "1m" });
      const refreshToken = sign(payload, refreshTokenSecret, {
        expiresIn: "2m",
      });

      return `${redirect}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    },
  }),
}));
