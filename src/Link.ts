import { createElement, type Ref } from "react";
import { useLinkProps } from "./useLinkProps";

type BaseProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type Props = BaseProps & {
  ref?: Ref<HTMLAnchorElement>;
  to: string;
  children?: React.ReactNode;
  replace?: boolean;
  activeStyle?: BaseProps["style"];
  activeClassName?: BaseProps["className"];
};

export const Link = ({
  onClick: baseOnClick,
  className,
  replace,
  style,
  target,
  to,
  activeClassName,
  activeStyle,
  ...props
}: Props) => {
  const { active, onClick } = useLinkProps({ href: to, replace, target });

  return createElement("a", {
    ...props,
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
};

Link.displayName = "Link";
