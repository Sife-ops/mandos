import axios from "axios";
import { Config } from "@serverless-stack/node/config";
import { sign } from "jsonwebtoken";
import { z } from "zod";

const { STAGE } = process.env;

const eventSchema = z.object({
  action: z.string().regex(/^sign-up$|^reset$/g),
  email: z.string(),
});

export const handler = async (event: any) => {
  try {
    const { action, email } = eventSchema.parse(
      JSON.parse(event.Records[0].body)
    );

    // todo: expiration
    const registrationToken = sign({ email }, Config.REGISTRATION_TOKEN_SECRET);

    let actionLink;
    switch (action) {
      case "sign-up":
        actionLink = `/confirm?registrationToken=${registrationToken}`;
        break;

      case "reset":
        actionLink = `/reset-password?registrationToken=${registrationToken}`;
        break;
    }

    const link = `${Config.SITE_URL}${actionLink}`;
    console.log("link:", link);

    if (STAGE === "prod") {
      const emailjsRsponse = await axios({
        method: "POST",
        url: "https://api.emailjs.com/api/v1.0/email/send",
        data: {
          service_id: Config.EMAILJS_SERVICE_ID,
          template_id: Config.EMAILJS_TEMPLATE_ID, // todo: rename
          user_id: Config.EMAILJS_USER_ID,
          // accessToken: Config.EMAILJS_ACCESSTOKEN,
          // todo: add more parameters
          template_params: {
            to_email: email,
            app_name: "Mandos",
            message: link, // todo: rename to 'link' in template
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("emailjs response:", emailjsRsponse.data);
    }
  } catch (e) {
    console.log(e);
  }
};
