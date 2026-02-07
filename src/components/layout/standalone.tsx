import React, { PropsWithChildren } from "react";

interface StandaloneLayoutProps extends PropsWithChildren {
    pageProps: any;
    children: any;
}

const StandaloneLayout = ({ children, pageProps }: StandaloneLayoutProps) => {
  return <div>{children}</div>;
};

export default StandaloneLayout;
