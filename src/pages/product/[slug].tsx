import Layout from "@components/layout";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getProductDetails } from "@utils/sfcc-connector/dataService";
import { GetServerSidePropsContext } from "next";
import compact from "lodash/compact";
import ProductDetailInfo from "@components/module/product/productDetailInfo";
import ContentBlock from "@components/module/contentBlock";
import { PdpTabs } from "@components/rendering";
import { getLocalePrefix, isEmpty, isKSALocale } from "@utils/helpers";
import { ScrollToTop, StickyWhatsapp } from "@components/module";
import { BookAppointmentProvider } from "@contexts/bookAppointmentContext";
import { getContentItemByKey } from "@utils/cms/amplience";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug = [] } = context.params || {};
  const plpKey = Array.isArray(slug) ? slug.join("/") : slug;
  const { vse } = context.query || {};

  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);

  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `/` },
      },
    },
    context
  );

  const product = await getProductDetails({ productId: plpKey, method: "GET" });

  if (isEmpty(product.response)|| product?.error) {
    return {
      redirect: {
        destination: `/${localePrefix}page-not-found`,
      },
    };
  }

  const shippingDeliveryKey = `shipping/${product?.response?.c_shippingContent ? product?.response?.brand.toLowerCase() : "global"}`

  const shippingData = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}${shippingDeliveryKey}`,
        },
      },
    },
    context
  );

  const amplienceDeliveryKey = `warranty/${product?.response?.c_warranty ? `brand/${product?.response?.c_warranty?.toLowerCase()}` : "global"}`;

  const warrantyData = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}${amplienceDeliveryKey}`,
        },
      },
    },
    context
  );
  const editorsView = await fetchStandardPageData(
    {
      content: {
        page: {
          key: `${localePrefix}product/editors-view`,
        },
      },
    },
    context
  );

  const sizeGuideDataKeyGender = product?.response?.c_gender?.toLowerCase();
  const sizeGuideDataKeyCategory =
    product?.response?.c_categoryName?.toLowerCase();
  const sizeGuidePlpKey = `${sizeGuideDataKeyGender}-${sizeGuideDataKeyCategory}`;

  const sizeGuideData = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}product-size-guide/${sizeGuidePlpKey}` },
      },
    },
    context
  );

  const productTechSpecs = product?.techSpecs || {};
  productTechSpecs.category = productTechSpecs?.category || null;

  const dataDictionary = await getContentItemByKey('dataDictionary');

  return {
    props: {
      ...data,
      dataDictionary,
      sizeGuideData,
      product: {
        ...product,
        techSpecs: productTechSpecs, // Ensure techSpecs have default values
      },
      shippingData,
      warrantyData,
      editorsView,
      vse: vse || "",
    },
  };
}

export default function ProductPage({
  content,
  dataDictionary,
  product,
  sizeGuideDataWomenWatches,
  sizeGuideDataMenWatches,
  shippingData,
  warrantyData,
  editorsView,
  sizeGuideData,
}) {
  const productTechSpecs = product?.techSpecs;
  const productResponse = product?.response;
  const dataDictionaryControl = dataDictionary?.pdpTabControl;

  console.log("content",content)

  return (
    <div className="main-content">
      <BookAppointmentProvider>
      <ProductDetailInfo
        product={product?.response}
        content={content}
        shippingData={shippingData?.content?.page}
        warrantyData={warrantyData?.content?.page}
        editorsView={editorsView?.content?.page}
        sizeGuideDataMenWatches={sizeGuideDataMenWatches}
        sizeGuideDataWomenWatches={sizeGuideDataWomenWatches}
        sizeGuideData={sizeGuideData}
      />
      </BookAppointmentProvider>
      {productTechSpecs.category &&
      <PdpTabs productTechSpecs={productTechSpecs} amplienceData={""} productResponse={productResponse} dataDictionary={dataDictionaryControl} />
      }
      {/* Other components like ScrollToTop and StickyWhatsapp */}
      {/*<StickyWhatsapp />*/}
      <ScrollToTop />
      {compact(content?.page?.components).map((content) => (
        <ContentBlock content={content} key={content?._meta.deliveryId} />
      ))}
    </div>
  );
}

ProductPage.Layout = Layout;
