import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTypedQuery, useTypedMutation } from "@mandos/graphql/urql";

export const Dev = () => {
  const nav = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [discriminator, setDiscriminator] = useState("");
  const [email, setEmail] = useState("");

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
    requestPolicy: "network-only",
  });

  useEffect(() => {
    const { fetching, data, error } = userQuery;
    if (!fetching && data) {
      const { user } = data;
      setUsername(user.username);
      setDiscriminator(user.discriminator);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl);
    }
  }, [userQuery.data]);

  return (
    <div>
      <h3>avatar</h3>
      <img src={avatarUrl} alt="logo" />
      <br />
      <button
        onClick={() => {
          nav("/change-avatar");
        }}
      >
        change avatar
      </button>
      <h3>username</h3>
      {username && (
        <span>
          {username}#{discriminator} {/* todo: discriminator */}
        </span>
      )}
      <button onClick={() => nav("/change-username")}>edit</button>
      <h3>email</h3>
      <span>{email}</span>
    </div>
  );
};
