import { mandosModel } from "@mandos/core/model";
import { z } from "zod";

const eventSchema = z.object({
  accessTokenSecret: z.string(),
  refreshTokenSecret: z.string(),
  serviceId: z.string(),
  redirect: z.string(),
  title: z.string(),
  logo: z.string().optional(),
});

export const handler = async (event: any) => {
  const service = eventSchema.parse(event);

  const res = await mandosModel.entities.ServiceEntity.create(service).go();
  console.log(res);
};
