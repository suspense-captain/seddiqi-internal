import Layout from "@components/layout";
import React, {useEffect} from "react";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext } from "next";
import { PlpContent } from "@components/module";
import { getProductListing } from "@utils/sfcc-connector/dataService";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { useContent } from "@contexts/withVisualizationContext";
import { UserProvider } from "@contexts/userContext";
import RolexTextBlock from "@components/rendering/rolex/rolexTextBlock";
import { ItemSlider } from "@components/rendering/rolex";
import RolexNavbar from "@components/rendering/rolex/rolexHeader";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug = [] } = context.params || {};
  const plpKey = Array.isArray(slug) ? slug.join('/') : slug;
  const { vse } = context.query || {};

  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const productPath = plpKey.toLowerCase().includes("rolex")
  ? `rolex/products/${plpKey}`
  : `products/${plpKey}`;


  const data = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}${productPath}`
        }
      },
    },
    context
  );

  const products = await getProductListing({ categoryId: plpKey, method: "POST", currentPage: 1, sort: 'availability' });

  if (!products) {
    return {
      redirect: {
        destination: `/${localePrefix}page-not-found`,
      },
    };
  }

  const components = data?.content?.page?.components || [];

  const rolexNavbarComponent = components.find(
    (comp) => comp?._meta?.schema.includes("rolex/navbar")
  );

  const rolexTextBlockComponent = components.find(
    (comp) => comp?._meta?.schema.includes("rolex/text-block")
  );

  const rolexItemSliderBlockComponent = components?.find(
    (comp) => comp?._meta?.schema?.includes("rolex/item-slider") || null
  );

  return {
    props: {
      ...data,
      products,
      vse: vse || '',
      plpKey,
      rolexNavbarComponent,
      rolexTextBlockComponent,
      rolexItemSliderBlockComponent
    },
  };
}


const Products = (props) => {
  const { vse, products, content, plpKey, rolexNavbarComponent, rolexTextBlockComponent, rolexItemSliderBlockComponent } = props;
  
  const [productGridContent] = useContent(content?.page?.productGridContent, vse);
  const isRolexCPO = plpKey && plpKey.toLowerCase().includes('rolex-cpo');

  return (
    <>
    {isRolexCPO && rolexNavbarComponent &&(
      <RolexNavbar content={rolexNavbarComponent} className={"forPlp"} />
    )}

    {isRolexCPO && rolexTextBlockComponent && (
        <RolexTextBlock content={rolexTextBlockComponent} className={rolexNavbarComponent ? "withPadding" : "withPaddingV2"} />
    )}
    
    <UserProvider><PlpContent products={products} productGridContent={productGridContent} /></UserProvider>;

    {isRolexCPO && rolexItemSliderBlockComponent && (
        <ItemSlider content={rolexItemSliderBlockComponent} />
    )}
    </>
  )
};

export default Products;

Products.Layout = Layout;
