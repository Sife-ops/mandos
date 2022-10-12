import { UserEntityType } from "@mandos/core/user";
import { mandosModel } from "@mandos/core/model";
import { builder } from "../builder";

const UserType = builder.objectRef<UserEntityType>("User");
UserType.implement({
  fields: (t) => ({
    id: t.exposeID("userId"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    confirmed: t.exposeBoolean("confirmed"),
  }),
});

const {
  entities: { UserEntity },
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

  //   user: t.field({
  //     type: UserType,
  //     resolve: () => {},
  //   }),

  login: t.string({
    // type: UserType,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: (_, { email }) => {
      UserEntity.query.email({ email });
      return "a";
    },
  }),
}));

builder.mutationFields((t) => ({
  //   createArticle: t.field({
  //     type: ArticleType,
  //     args: {
  //       title: t.arg.string({ required: true }),
  //       url: t.arg.string({ required: true }),
  //     },
  //     resolve: (_, args) => Article.create(args.title, args.url),
  //   }),
  hello: t.string({
    resolve: () => "hello",
  }),
}));
