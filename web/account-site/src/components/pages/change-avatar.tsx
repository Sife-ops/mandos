import defaultAvi from "../../assets/default.png";
import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useNavigate } from "react-router-dom";

export const ChangeAvatar = () => {
  const nav = useNavigate();

  const [avatar, setAvatar] = useState("");

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
      nav("/account");
    }
  }, [changeAvatarState.data]);

  return (
    <div>
      <img src={avatar ? avatar : defaultAvi} alt="logo" />
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
        disabled={!avatar}
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
