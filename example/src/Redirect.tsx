import * as React from "react";
import { Router } from "./router";

export const Redirect = ({ to }: { to: string }) => {
  const location = Router.useLocation().toString();

  React.useLayoutEffect(() => {
    if (to !== location) {
      Router.unsafeReplace(to);
    }
  }, []);

  return null;
};
