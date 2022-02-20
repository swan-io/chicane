import * as React from "react";

export const useIsUpdate = (): boolean => {
  const isUpdate = React.useRef(false);

  if (!isUpdate.current) {
    isUpdate.current = true;
    return false;
  }

  return isUpdate.current;
};
