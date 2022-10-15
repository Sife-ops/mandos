// import * as yup from "yup";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useState, useEffect } from "react";

// todo: email validation
// const emailSchema = yup
//   .string()
//   .email()
//   .required();

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resent, setResent] = useState(false);
  //   const [emailIsValid, setEmailIsValid] = useState(false);

  //   useEffect(() => {
  //     if (emailSchema.isValidSync(email)) {
  //       setEmailIsValid(true);
  //     } else {
  //       setEmailIsValid(false);
  //     }
  //   }, [email]);

  const [sendResetEmailState, sendResetEmail] = useTypedMutation(
    (vars: { email: string }) => {
      return {
        sendResetEmail: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = sendResetEmailState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      console.log(data);
      setResent(true);
    }
  }, [sendResetEmailState.data]);

  return (
    <div>
      <h3>Send Reset E-mail</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendResetEmail({ email });
          // todo: disable after submit
        }}
      >
        <label>
          E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button
          // disabled={!emailIsValid}
          type={"submit"}
        >
          Send E-mail
        </button>
      </form>
      {resent && <div>E-mail sent!</div>}
    </div>
  );
};
