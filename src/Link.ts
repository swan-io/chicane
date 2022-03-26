import * as React from "react";
import { LinkProps } from "./types";
import { useLink } from "./useLink";

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      onClick: baseOnClick,
      className,
      replace,
      style,
      target,
      to,
      activeClassName,
      activeStyle,
      ...props
    },
    forwardedRef,
  ) => {
    const { active, onClick } = useLink({ href: to, replace, target });

    return React.createElement("a", {
      ...props,
      ref: forwardedRef,
      href: to,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        baseOnClick?.(event);
        onClick(event);
      },
      target,
      className:
        !active || activeClassName == null
          ? className
          : className == null
          ? activeClassName
          : `${className} ${activeClassName}`,
      style:
        !active || activeStyle == null
          ? style
          : style == null
          ? activeStyle
          : { ...style, ...activeStyle },
    });
  },
);

Link.displayName = "Link";
