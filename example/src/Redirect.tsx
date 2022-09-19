import { replaceUnsafe, useLocation } from "@swan-io/chicane";
import * as React from "react";

export const Redirect = ({ to }: { to: string }) => {
  const location = useLocation().toString();

  React.useLayoutEffect(() => {
    if (to !== location) {
      replaceUnsafe(to);
    }
  }, []);

  return null;
};
