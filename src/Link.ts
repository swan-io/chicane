import * as React from "react";
import { useLinkProps } from "./useLinkProps";

type BaseProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type Props = BaseProps & {
  to: string;
  children?: React.ReactNode;
  replace?: boolean;
  activeStyle?: BaseProps["style"];
  activeClassName?: BaseProps["className"];
};

export const Link = React.forwardRef<HTMLAnchorElement, Props>(
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
    const { active, onClick } = useLinkProps({ href: to, replace, target });

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
