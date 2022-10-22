import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useNavigate } from "react-router-dom";

export const ChangeAvatar = () => {
  const nav = useNavigate();

  const [avatar, setAvatar] = useState("");

  //   const [avatarChanged, setAvatarChanged] = useState(false);
  //   const [avatarUrl, setAvatarUrl] = useState("");
  //   const [avatarUrlChanged, setAvatarUrlChanged] = useState(false);

  const [changeAvatarState, changeAvatar] = useTypedMutation(
    (vars: { avatar: string }) => {
      return {
        changeAvatar: [vars],
      };
    }
  );

  useEffect(() => {
    const { fetching, data, error } = changeAvatarState;
    if (!fetching && data && !error) {
      nav("/dev");
    }
  }, [changeAvatarState.data]);

  return (
    <div>
      <h3>avatar</h3>
      <img src={avatar} alt="logo" />
      <br />

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
      <br />

      <button
        onClick={() => {
          if (avatar) {
            changeAvatar({ avatar });
          }
        }}
      >
        Save
      </button>
    </div>
  );
};
