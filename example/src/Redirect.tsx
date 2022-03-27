import * as React from "react";
import { replaceUnsafe, useLocation } from "../../src";

export const Redirect = ({ to }: { to: string }) => {
  const location = useLocation().toString();

  React.useLayoutEffect(() => {
    if (to !== location) {
      replaceUnsafe(to);
    }
  }, []);

  return null;
};
