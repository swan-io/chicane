import { useEffect, useId } from "react";
import { block } from "./history";

export const useBlocker = (blocked: boolean, message: string) => {
  const id = useId();

  useEffect(() => {
    if (blocked) {
      return block({ id, message });
    }
  });
};
