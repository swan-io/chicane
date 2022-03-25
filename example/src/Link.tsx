import * as React from "react";
import { Router } from "./router";

export const Link = ({
  children,
  replace,
  target,
  to,
  ...props
}: {
  children?: React.ReactNode;
  to: string;
  replace?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
}) => {
  const { active, onClick } = Router.useLink({ href: to, replace, target });

  return (
    <a
      href={to}
      onClick={onClick}
      target={target}
      {...props}
      style={{
        fontWeight: active ? 700 : 400,
      }}
    >
      {children}
    </a>
  );
};
