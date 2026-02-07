import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null;

    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Explore curated luxury watches, jewellery and services at Ahmed Seddiqi - Dubai’s trusted timekeepers since 1950."
          />
        </Head>
        <body className="seddiqi-theme">
          {GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
