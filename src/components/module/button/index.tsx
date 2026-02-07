import classNames from "classnames";
import Link from "next/link";
import router from "next/router";
import React from "react";

interface ButtonProps {
  title: string;
  type?: string | undefined;
  color?: string | undefined;
  clickHandler?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  new_tab?: boolean;
  link?: string;
  isLink?: boolean;
  className?: any;
  rolexClass?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  type,
  clickHandler,
  disabled,
  color,
  new_tab,
  link,
  isLink = false,
  className,
  rolexClass
}) => {
  if (!title) {
    return null;
  }

  if (isLink) {
    return (
      <Link
        className={classNames(className, `${rolexClass ? rolexClass: 'button'}`, type?.toLowerCase(), color?.toLowerCase(), disabled && "disabled")}
        href={link || "/"}
        {...(new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className={className}> {title} </span>
      </Link>
    );
  } else {
    return (
      <button
        className={classNames(className, `${rolexClass ? rolexClass: 'button'}`, type?.toLowerCase(), color?.toLowerCase())}
        disabled={disabled}
        onClick={clickHandler ? clickHandler : () => router.push(link || "/")}
      >
        <span className={className}>{title}</span>
      </button>
    );
  }
};

export default Button;
