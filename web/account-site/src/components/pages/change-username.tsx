import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useNavigate } from "react-router-dom";

export const ChangeUsername = () => {
  const nav = useNavigate();

  const [username, setUsername] = useState<string>("");

  const [changeUsernameState, changeUsername] = useTypedMutation(
    (vars: { username: string }) => {
      return {
        changeUsername: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = changeUsernameState;
    if (!fetching && data && !error) {
      nav("/dev");
    }
  }, [changeUsernameState.data]);

  return (
    <div>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />

      <button
        disabled={!username}
        onClick={() => {
          if (username) {
            changeUsername({ username });
          }
        }}
      >
        Save
      </button>
    </div>
  );
};
