import { useParams } from "react-router-dom";

export const Error = () => {
  const { error } = useParams();

  switch (error) {
    case "404":
      return (
        <div>
          <div>Page not found.</div>
        </div>
      );

    default:
      return <></>;
  }
};
