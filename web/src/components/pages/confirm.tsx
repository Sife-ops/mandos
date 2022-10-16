import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useEffect } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const Confirm = () => {
  const nav = useNavigate();

  let registrationToken: string;
  try {
    const [_] = useQueryParam(["registrationToken"]);
    registrationToken = _;
  } catch {
    nav("/error/404");
  }

  const [confirmState, confirm] = useTypedMutation(
    (vars: { registrationToken: string }) => {
      return {
        confirm: [vars],
      };
    }
  );

  useEffect(() => {
    confirm({
      registrationToken,
    });
  }, []);

  useEffect(() => {
    const { fetching, data, error } = confirmState;
    if (error) {
      console.error(error.message);
    } else if (!fetching && data) {
      nav("/success/confirmed");
    }
  }, [confirmState.data]);

  return <div>loading...</div>;
};
