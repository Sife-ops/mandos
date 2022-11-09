import { useEffect } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useState } from "react";
import { useQueryParam } from "@mandos/react/query-param";

export const Unconfirmed = () => {
  const { email } = useQueryParam(
    {
      email: { required: true },
    },
    "/error/404"
  );

  const [resent, setResent] = useState(false);

  const [resendEmailState, resendEmail] = useTypedMutation(
    (vars: { email: string }) => {
      return {
        resendEmail: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = resendEmailState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      console.log(data);
      setResent(true);
    }
  }, [resendEmailState]);

  return (
    <div>
      <div>An access link has been sent to your e-mail.</div>
      <div>
        If you didn't receive an email, click the button to send it again.
      </div>
      <button
        onClick={() => {
          if (email) {
            resendEmail({ email });
          }
        }}
      >
        Send E-mail
      </button>
      {resent && <div>E-mail sent!</div>}
    </div>
  );
};
