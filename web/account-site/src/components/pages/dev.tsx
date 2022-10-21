import { useEffect } from "react";
import { useTypedQuery } from "@mandos/graphql/urql";

export const Dev = () => {
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

  return <div>dev</div>;
};
