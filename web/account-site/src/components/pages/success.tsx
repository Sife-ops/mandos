import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Success = () => {
  const nav = useNavigate();
  const { effect } = useParams();

  const serviceId = localStorage.getItem("serviceId");

  useEffect(() => {
    switch (effect) {
      case "email-resent":
        break;

      default:
        if (serviceId) {
          setTimeout(() => {
            nav(`/sign-in?serviceId=${serviceId}`);
          }, 5000);
        }
        break;
    }
  }, []);

  switch (effect) {
    case "email-resent":
      // todo: success styles
      return (
        <div>
          <div>E-mail resent!</div>
        </div>
      );

    case "password-reset":
      return (
        <div>
          <div>Password reset!</div>
          {serviceId && <div>Redirecting...</div>}
        </div>
      );

    case "confirmed":
      return (
        <div>
          <div>Account confirmed!</div>
          {serviceId && <div>Redirecting...</div>}
        </div>
      );

    default:
      return <></>;
  }
};
