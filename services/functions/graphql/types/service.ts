import { ServiceEntityType } from "@mandos/core/service";
import { builder } from "../builder";

export const ServiceType = builder.objectRef<
  ServiceEntityType & {
    logoUrl: string;
  }
>("Service");
ServiceType.implement({
  fields: (t) => ({
    serviceId: t.exposeID("serviceId"),
    title: t.exposeString("title"),
    logoUrl: t.exposeString("logoUrl"),
    redirect: t.exposeString("redirect"),
  }),
});
