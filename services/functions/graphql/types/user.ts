import { UserEntityType } from "@mandos/core/user";
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
