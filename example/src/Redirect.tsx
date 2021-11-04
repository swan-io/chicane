import * as React from "react";
import { unsafeReplace, useLocation } from "./router";

export const Redirect = ({ to }: { to: string }) => {
  const { url } = useLocation();

  React.useLayoutEffect(() => {
    if (to !== url) {
      unsafeReplace(to);
    }
  }, []);

  return null;
};
