import { mandosModel } from "@mandos/core/model";
import { tokenOptions } from "../constant";
import { verify, sign } from "jsonwebtoken";
import { z } from "zod";

const eventSchema = z.object({
  serviceId: z.string(),
  refreshToken: z.string(),
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

    const { email, userId, serviceId } = verify(
      validated.refreshToken,
      service.refreshTokenSecret
    ) as { email: string; userId: string; serviceId: string };
    const accessToken = sign(
      { email, userId, serviceId },
      service.accessTokenSecret,
      tokenOptions.accessToken
    );

    return {
      success: true,
      accessToken,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e,
    };
  }
};
