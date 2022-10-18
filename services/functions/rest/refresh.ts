import { mandosModel } from "@mandos/core/model";
import { tokenOptions } from "../constant";
import { verify, sign, decode } from "jsonwebtoken";
import { z } from "zod";

const eventSchema = z.object({
  refreshToken: z.string(),
});

export const handler = async (event: any) => {
  try {
    const { refreshToken } = eventSchema.parse(JSON.parse(event.body));

    const { serviceId, email, userId } = decode(refreshToken) as {
      serviceId: string;
      email: string;
      userId: string;
    };
    const {
      data: [service],
    } = await mandosModel.entities.ServiceEntity.query
      .service({ serviceId })
      .go();

    verify(refreshToken, service.refreshTokenSecret);
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
