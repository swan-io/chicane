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
  replace?: boolean | undefined;
  target?: React.HTMLAttributeAnchorTarget | undefined;
}) => {
  const { active, onClick } = useLink({ href, replace, target });

  return (
    <a href={href} target={target} onClick={onClick} {...props}>
      {children}
    </a>
  );
};
