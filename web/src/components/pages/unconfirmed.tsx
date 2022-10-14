// import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryParam } from "../../hook/query-param";

export const Unconfirmed = () => {
  const nav = useNavigate();

  let email: string;
  try {
    const [_] = useQueryParam(["email"]);
    email = _;
  } catch {
    nav("/error/404");
  }

  const [resent, setResent] = useState(false);

  return (
    <div>
      <div>An access link has been sent to your e-mail.</div>
      <div>
        If you didn't receive an email, click the button to send it again.
      </div>
      {/* <div>If you still didn't receive an email, try again later.</div> */}
      <button
      // onClick={() => {
      //   fetch(import.meta.env.VITE_API_URL + "/resend-email", {
      //     method: "POST",
      //     body: JSON.stringify({
      //       email,
      //     }),
      //   })
      //     .then((e) => e.json())
      //     .then((e) => {
      //       if (e.success) {
      //         setResent(true);
      //       } else {
      //         console.error(e);
      //       }
      //     });
      // }}
      >
        Send E-mail
      </button>
      {resent && <div>E-mail sent!</div>}
    </div>
  );
};
