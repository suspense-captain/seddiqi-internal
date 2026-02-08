import React, { Component, PropsWithChildren, useEffect } from "react";
import { Header, Footer } from "@components/rendering";
import { WithNavigationContext } from "@contexts/withNavigationContext";
import { HeaderProvider } from "@contexts/headerContext";
import { SearchProvider } from "@contexts/searchContext";

export interface LayoutProps extends PropsWithChildren {
  pageProps: any;
  children: any;
}

const Layout = ({ children, pageProps }: LayoutProps) => {
  let headerData = pageProps?.hierarchies?.pages?.find((data) =>
    data?.root?.key?.includes("headerNavigation")
  );
  const footerData = pageProps?.hierarchies?.pages?.find((data) =>
    data?.root?.key?.includes("footerNavigation")
  );

  console.log("headerData", headerData)

  return (
    <SearchProvider>
      <HeaderProvider headerData={{ ...headerData }}>
        <Header />
        <main className="mainClass">{children}</main>
        <Footer footerData={footerData} />
      </HeaderProvider>
    </SearchProvider>
  );
};

export default Layout;
