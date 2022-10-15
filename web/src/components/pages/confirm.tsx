import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useEffect } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";

export const Confirm = () => {
  const nav = useNavigate();

  let signupToken: string;
  try {
    const [_] = useQueryParam(["signupToken"]);
    signupToken = _;
  } catch {
    nav("/error/404");
  }

  const [confirmState, confirm] = useTypedMutation(
    (vars: { signupToken: string }) => {
      return {
        confirm: [vars],
      };
    }
  );

  useEffect(() => {
    confirm({
      signupToken,
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
