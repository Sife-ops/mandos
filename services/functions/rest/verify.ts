import { mandosModel } from "@mandos/core/model";
import { verify } from "jsonwebtoken";
import { z } from "zod";

const eventSchema = z.object({
  serviceId: z.string(),
  accessToken: z.string(),
});

export const handler = async (event: any) => {
  try {
    const validated = eventSchema.parse(JSON.parse(event.body));

    const {
      data: [service],
    } = await mandosModel.entities.ServiceEntity.query
      .service({
        serviceId: validated.serviceId,
      })
      .go();

    verify(validated.accessToken, service.accessTokenSecret);

    return {
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e,
    };
  }
};
