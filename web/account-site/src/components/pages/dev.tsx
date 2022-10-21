import { useEffect, useState } from "react";
import { useTypedQuery, useTypedMutation } from "@mandos/graphql/urql";

export const Dev = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarChanged, setAvatarChanged] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameChanged, setUsernameChanged] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [userQuery] = useTypedQuery({
    query: {
      user: {
        confirmed: true,
        discriminator: true,
        email: true,
        userId: true,
        username: true,
        avatar: true,
      },
    },
  });

  useEffect(() => {
    const { fetching, data, error } = userQuery;
    if (!fetching && data) {
      console.log(data);
      const { user } = data;
      setAvatar(user.avatar);
      setUsername(user.username);
    }
  }, [userQuery.data]);

  const [changeUsernameState, changeUsername] = useTypedMutation(
    (vars: { username: string }) => {
      return {
        changeUsername: [
          vars,
          {
            confirmed: true,
            discriminator: true,
            email: true,
            userId: true,
            username: true,
            avatar: true,
          },
        ],
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
        <h3>change avatar</h3>
        <input type="file" name="file" onChange={(e) => console.log(e)} />

        <h3>change username</h3>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <h3>change password</h3>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />

        <button type={"submit"}>update</button>
      </form>
    </div>
  );
};
