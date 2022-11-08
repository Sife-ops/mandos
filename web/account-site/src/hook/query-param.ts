import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useQueryParam = (
  paramNames: Record<string, { required: boolean }>,
  errorTo: string
) => {
  const nav = useNavigate();
  const search = window.location.search;
  const params = new URLSearchParams(search);

  const [values, setValues] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let values_: Record<string, string | null> = {};
    for (const key in paramNames) {
      const value = params.get(key);
      if (!value && paramNames[key].required) {
        console.log("param missing:", key);
        nav(errorTo);
        return;
      }
      values_ = {
        ...values_,
        [key]: value,
      };
    }
    setValues((s) => ({
      ...s,
      ...values_,
    }));
  }, []);

  return values;
};
