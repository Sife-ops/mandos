import { useEffect, useState } from "react";
import { useTypedQuery, useTypedMutation } from "@mandos/graphql/urql";

export const Dev = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarChanged, setAvatarChanged] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUrlChanged, setAvatarUrlChanged] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameChanged, setUsernameChanged] = useState(false);

  const [email, setEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);

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
        avatarUrl: true,
      },
    },
  });

  useEffect(() => {
    const { fetching, data, error } = userQuery;
    if (!fetching && data) {
      console.log(data);
      const { user } = data;
      // setAvatar(user.avatar);
      setUsername(user.username);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl);
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

  const [changeAvatarState, changeAvatar] = useTypedMutation(
    (vars: { avatar: string }) => {
      return {
        changeAvatar: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = changeAvatarState;
    console.log(data);
  }, [changeAvatarState.data]);

  return (
    <div>
      <h3>avatar</h3>
      <img src={avatarUrl} alt="logo" />

      <input
        type="file"
        name="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files !== null) {
            const file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
              const { result } = reader;
              if (result && typeof result === "string") {
                setAvatar(result);
              }
            };

            reader.onerror = (error) => {
              console.log("Error: ", error);
            };
          }
        }}
      />

      <button
        onClick={() => {
          if (avatar) {
            changeAvatar({ avatar });
          }
        }}
      >
        go
      </button>

      <h3>username</h3>
      {username}
      <button>edit</button>

      <h3>email</h3>
      {email}
      <button>edit</button>
    </div>
  );
};
