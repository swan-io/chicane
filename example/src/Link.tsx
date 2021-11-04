import * as React from "react";
import { useLink } from "./router";

export const Link = ({
  children,
  href,
  replace,
  target,
  ...props
}: {
  children?: React.ReactNode;
  href: string;
  replace?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
}) => {
  const { active, onClick } = useLink({ href, replace, target });

  return (
    <a
      href={href}
      target={target}
      onClick={onClick}
      {...props}
      style={{
        fontWeight: active ? 700 : 400,
      }}
    >
      {children}
    </a>
  );
};
