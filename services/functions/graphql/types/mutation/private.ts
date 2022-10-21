import { builder } from "../../builder";
import { mandosModel } from "@mandos/core/model";

const {
  entities: { UserEntity },
} = mandosModel;

builder.mutationFields((t) => ({
  // todo: return user type
  changeUsername: t.boolean({
    args: {
      username: t.arg.string({ required: true }),
    },
    resolve: async (_, { username }, { user: { userId } }) => {
      // todo: remove email rangekey
      const {
        data: [user],
      } = await UserEntity.query.user({ userId }).go();

      await UserEntity.update(user)
        .set({ username })
        .go();

      return true;
    },
  }),
}));
