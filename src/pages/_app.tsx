import "../assets/styles/main.scss";
import "../assets/styles/globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren, useEffect } from "react";
import { Head } from "@components/module";
import React from "react";
import LanguageProvider from "@contexts/languageContext";

import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import ErrorPage from "next/error";
import WithVisualization from "@contexts/withVisualizationContext";
import { WithAppContext } from "@contexts/appContext";
import { WithCmsContext } from "@contexts/cmsContext";
import RouteLoader from "@components/module/routeLoader";
import { RolexProvider } from "@contexts/rolexContext";
import { SessionProvider } from "next-auth/react";
import { GeoProvider } from "@contexts/geoLocationContext";
import RolexAdobeScript from "@components/module/rolex-adobe-script";
import Script from "next/script";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface NoopProps extends PropsWithChildren {}

const Noop = ({ children }: NoopProps) => <>{children}</>;

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const Layout = (Component as any).Layout || Noop;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null;

  if ((pageProps as any).statusCode) {
    return <ErrorPage statusCode={(pageProps as any).statusCode} />;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = (url: string) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: url,
      });
    };

    handleRouteChange(window.location.pathname);

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
          }}
        />
      )}

      <LanguageProvider>
        <GeoProvider>
          <SessionProvider session={pageProps.session}>
            <RolexProvider>
              <Head />
              <WithAppContext value={(pageProps as any).context?.appContext}>
                <WithVisualization>
                  <WithCmsContext
                    value={(pageProps as any).context?.cmsContext}
                  >
                    <RouteLoader />
                    <Layout pageProps={pageProps}>
                      <RolexAdobeScript />
                      <Component {...pageProps} key={router.locale} />
                    </Layout>
                  </WithCmsContext>
                </WithVisualization>
              </WithAppContext>
            </RolexProvider>
          </SessionProvider>
        </GeoProvider>
      </LanguageProvider>
    </>
  );
}
