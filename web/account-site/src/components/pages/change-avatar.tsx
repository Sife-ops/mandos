import defaultAvi from "../../assets/default.png";
import { useEffect, useState } from "react";
import { useTypedMutation } from "@mandos/graphql/urql";
import { useNavigate } from "react-router-dom";

export const ChangeAvatar = () => {
  const nav = useNavigate();

  const [avatar, setAvatar] = useState("");
  const [size, setSize] = useState(0);

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
      <img
        style={{
          width: "128px",
          height: "128px",
        }}
        src={avatar ? avatar : defaultAvi}
        alt="logo"
      />
      <br />

      <input
        type="file"
        name="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files !== null) {
            const file = files[0];
            setSize(file.size);
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
      <span>Files must be less than 1MB.</span>
      <br />

      <button
        disabled={!avatar || size > 1000000}
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
