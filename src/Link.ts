import {
  createElement,
  type AnchorHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { useLinkProps } from "./useLinkProps";

type BaseProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type Props = BaseProps & {
  ref?: Ref<HTMLAnchorElement>;
  to: string;
  children?: ReactNode;
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
    onClick: (event) => {
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
