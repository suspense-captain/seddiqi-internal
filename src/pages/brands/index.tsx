import Layout from "@components/layout";
import { BrandListing, ScrollToTop } from "@components/module";
import ViewAllBrandsCategory from "@components/module/brands/viewAllBrandsCategory";
import ContentBlock from "@components/module/contentBlock";
import { HeroBanner } from "@components/rendering";
import { useContent } from "@contexts/withVisualizationContext";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { CmsContent } from "@utils/cms/utils";
import { getLocalePrefix, isEmpty, notNull } from "@utils/helpers";
import { getCategory } from "@utils/sfcc-connector/dataService";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { fetchBrandPages } from "@utils/helpers/fetchBrandPages"
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const country = context.req.cookies?.country || "UAE";

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}brands` },
      },
    },
    context
  );

  const brandPagesResponse = (await fetchBrandPages(context, {})) || [];
  const { vse } = context.query || {};

  const locale = context.locale || "default";
  const brands = await getCategory({
    method: "GET",
    cgid: "brands",
    locale: locale,
  });

  let brandPages = brandPagesResponse
    .filter(({ content }) => {
      if (locale.toLowerCase() === "en-ae" && content._meta.deliveryKey.startsWith("brand/")) {
        return content;
      }
      return content._meta.deliveryKey.includes(locale);
    })
    .map(({ content }) => {
      return {
        url: content._meta.deliveryKey,
      };
    });

  if (country.toLowerCase() !== "sa") {
    brandPages.push({ url: "rolex" }, { url: "rolex/cpo" });
  }

  return {
    props: {
      ...data,
      vse: vse || "",
      ...brands.response,
      brandPages,
    },
  };
}

export default function ViewAllBrandsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { vse, content, categories, brandPages } = props;
  const [page] = useContent(content.page, vse as string);
  const heroBanner = content?.page?.heroBanner;

  return (
    <div className="brand-lister-main-content">
      {heroBanner && (
        <HeroBanner
          banners={heroBanner?.banners}
          bannerType={heroBanner?.bannerType}
        />
      )}
      <ViewAllBrandsCategory />
      <BrandListing categories={categories.sort((a, b) => (a.name > b.name ? 1 : -1))} brandPages={brandPages} haveScrollbars={false} />
      <ScrollToTop />
    </div>
  );
}

ViewAllBrandsPage.Layout = Layout;
