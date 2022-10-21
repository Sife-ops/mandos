import { builder } from "../../builder";
import { mandosModel } from "@mandos/core/model";
import { UserType } from "../user";
import { UserEntityType } from "@mandos/core/user";

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

  changePassword: t.field({
    type: UserType,
    args: {
      password: t.arg.string({ required: true }),
    },
    resolve: (_, args, { user }) => updateAttrs(user, args),
  }),

  changeAvatar: t.field({
    type: UserType,
    args: {
      avatar: t.arg.string({ required: true }),
    },
    resolve: (_, args, { user }) => updateAttrs(user, args),
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

  return updated;
};
