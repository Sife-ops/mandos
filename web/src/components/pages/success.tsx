import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Success = () => {
  const nav = useNavigate();
  const { effect } = useParams();

  // todo: redirect after timeout

  switch (effect) {
    case "email-resent":
      return (
        <div>
          <div>E-mail resent!</div>
        </div>
      );

    case "password-reset":
      return (
        <div>
          <div>Password reset!</div>
        </div>
      );

    case "confirmed":
      return (
        <div>
          <div>Account confirmed!</div>
        </div>
      );

    default:
      return <></>;
  }
};
