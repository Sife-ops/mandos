import { useEffect, useState } from "react";
import { useTypedQuery, useTypedMutation } from "@mandos/graphql/urql";

export const Dev = () => {
  const [username, setUsername] = useState("");

  const [userQuery] = useTypedQuery({
    query: {
      user: {
        confirmed: true,
        discriminator: true,
        email: true,
        userId: true,
        username: true,
      },
    },
  });

  useEffect(() => {
    const { fetching, data, error } = userQuery;
    console.log(data);
  }, [userQuery.data]);

  const [changeUsernameState, changeUsername] = useTypedMutation(
    (vars: { username: string }) => {
      return {
        changeUsername: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = changeUsernameState;
    console.log(data);
  }, [changeUsernameState.data]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("hi");
          changeUsername({ username });
        }}
      >
        <h3>change username</h3>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button type={"submit"}>update</button>
      </form>
    </div>
  );
};
