import { Service } from "electrodb";

import { ServiceEntity } from "./service";
import { UserEntity } from "./user";

export const mandosModel = new Service({
  ServiceEntity,
  UserEntity,
});
