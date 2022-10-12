import bcrypt from "bcryptjs";
import { UserEntityType } from "@mandos/core/user";
import { builder } from "../builder";
import { mandosModel } from "@mandos/core/model";
import { sign } from "jsonwebtoken";

// const UserType = builder.objectRef<UserEntityType>("User");
// UserType.implement({
//   fields: (t) => ({
//     id: t.exposeID("userId"),
//     email: t.exposeString("email"),
//     password: t.exposeString("password"),
//     confirmed: t.exposeBoolean("confirmed"),
//   }),
// });

const SignInResponseType = builder.objectRef<{
  redirect: string;
  accessToken: string;
}>("SignInResponse");
SignInResponseType.implement({
  fields: (t) => ({
    redirect: t.exposeString("redirect"),
    accessToken: t.exposeString("accessToken"),
  }),
});

const {
  entities: { UserEntity, ServiceEntity },
} = mandosModel;

builder.queryFields((t) => ({
  //   article: t.field({
  //     type: ArticleType,
  //     args: {
  //       articleID: t.arg.string({ required: true }),
  //     },
  //     resolve: async (_, args) => {
  //       const result = await Article.get(args.articleID);
  //       if (!result) {
  //         throw new Error("Article not found");
  //       }
  //       return result;
  //     },
  //   }),
  //   articles: t.field({
  //     type: [ArticleType],
  //     resolve: () => Article.list(),
  //   }),

  hello: t.string({
    resolve: () => "hello",
  }),
}));

builder.mutationFields((t) => ({
  signIn: t.field({
    type: SignInResponseType,
    args: {
      url: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { url, email, password }) => {
      const { data: serviceQuery } = await ServiceEntity.query
        .url({ url })
        .go();
      if (serviceQuery.length < 1) throw new Error("service not found");
      const [{ redirect }] = serviceQuery;

      const { data: userQuery } = await UserEntity.query.email({ email }).go();
      if (userQuery.length < 1) throw new Error("user not found");
      const [user] = userQuery;

      const compared = bcrypt.compareSync(password, user.password);
      if (!compared) throw new Error("incorrect password");
      if (!user.confirmed) throw new Error("unconfirmed");

      const accessToken = sign(
        { email, userId: user.userId },
        "todo: access token secret",
        {
          expiresIn: "1m",
        }
      );

      return {
        redirect,
        accessToken,
      };
    },
  }),
}));
