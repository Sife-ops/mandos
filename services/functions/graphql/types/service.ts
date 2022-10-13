import { ServiceEntityType } from "@mandos/core/service";
import { builder } from "../builder";

export const ServiceType = builder.objectRef<ServiceEntityType>("Service");
ServiceType.implement({
  fields: (t) => ({
    serviceId: t.exposeID("serviceId"),
    title: t.exposeString("title"),
    logo: t.exposeString("logo"),
    redirect: t.exposeString("redirect"),
  }),
});
