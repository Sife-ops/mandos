import { UserEntityType } from "@mandos/core/user";
import { faker } from "@faker-js/faker";

export const getDiscriminator = (users: UserEntityType[]) => {
  let discriminator = "0000";

  if (users.length >= 10000) {
    throw new Error("username unavailable");
  } else if (users.length > 0) {
    while (true) {
      if (!users.find((e) => e.discriminator === discriminator)) {
        break;
      }
      discriminator = faker.datatype
        .number({ min: 10001, max: 19999 })
        .toString()
        .slice(1);
    }
  }

  return discriminator;
};
