import { useParams } from "react-router-dom";

export const Error = () => {
  const { error } = useParams();

  return (
    <div>
      <div>{error}</div>
    </div>
  );
};
