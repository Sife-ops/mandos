import { Service } from "electrodb";

import { UserEntity } from "./user";

export const mandosModel = new Service({
  UserEntity,
});
