import Layout from "@components/layout";
import {
  RolexNavbar,
  RolexHeroBanner,
  FooterBackToTop,
} from "@components/rendering/rolex";
import NeedMoreHelp from "@components/rendering/needMoreHelp";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { isEmpty, isKSALocale } from "@utils/helpers";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const localePrefix =
    context.locale && context.locale !== context.defaultLocale
      ? `${context.locale}/`
      : "";

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}rolex/thank-you` },
      },
    },
    context
  );

  if (isEmpty(data?.content?.page)) {
    if (isKSALocale(context?.locale)) {
      return {
        redirect: {
          destination: "/en-SA",
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: "/page-not-found",
      },
    };
  }

  return {
    props: {
      ...data,
    },
  };
}

export default function RolexThankYouPage({ ...content }) {
  const components = content?.content?.page?.components || [];
  const navbar = components.find((comp) =>
    comp._meta.schema.includes("navbar")
  );
  const heroBanner = components.find((comp) =>
    comp._meta.schema.includes("hero-banner")
  );
  const needMoreHelp = components.find((comp) =>
    comp._meta.schema.includes("need-help")
  );

  return (
    <div className="main-content rolex">
      {navbar && <RolexNavbar {...navbar} />}
      {heroBanner && <RolexHeroBanner {...heroBanner} />}
      {needMoreHelp && <NeedMoreHelp {...needMoreHelp} />}

      {content?.content?.page?.footerBlock && (
        <FooterBackToTop
          contentImage={
            content?.content?.page?.footerBlock?.footer?.media?.image
          }
          contentAlt={
            content?.content?.page?.footerBlock?.footer?.media?.altText
          }
        />
      )}
    </div>
  );
}

RolexThankYouPage.Layout = Layout;
