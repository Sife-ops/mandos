import { mandosModel } from "@mandos/core/model";
import { verify, decode } from "jsonwebtoken";
import { z } from "zod";

const eventSchema = z.object({
  accessToken: z.string(),
});

export const handler = async (event: any) => {
  try {
    const { accessToken } = eventSchema.parse(JSON.parse(event.body));

    const { serviceId } = decode(accessToken) as { serviceId: string };
    const {
      data: [service],
    } = await mandosModel.entities.ServiceEntity.query
      .service({ serviceId })
      .go();

    verify(accessToken, service.accessTokenSecret);

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
