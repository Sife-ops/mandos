import { UserEntityType } from "@mandos/core/user";
import { builder } from "../builder";

export const UserType = builder.objectRef<
  UserEntityType & { avatarUrl: string }
>("User");
UserType.implement({
  fields: (t) => ({
    userId: t.exposeID("userId"),
    email: t.exposeString("email"),
    username: t.exposeString("username"),
    discriminator: t.exposeString("discriminator"),
    confirmed: t.exposeBoolean("confirmed"),
    avatarUrl: t.exposeString("avatarUrl"),
  }),
});
