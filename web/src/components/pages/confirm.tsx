import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../../hook/query-param";
import { useState, useEffect } from "react";
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

  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  }, [confirmState.data]);

  if (loading) {
    //@ts-ignore
    return <div>loading...</div>;
  }

  return <div>congratulations!</div>;
};
