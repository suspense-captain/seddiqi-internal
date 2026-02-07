import Layout from "@components/layout";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getLocalePrefix } from "@utils/helpers";
import RolexMapStoreDetailsPageContent from "@components/module/rolexMapStoreDetailsPageContent";
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.params!;
    const { mapView, isCPOPage } = context.query;
    
    const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
    
    if (localePrefix?.includes("-ae")) {
      return {
        redirect: {
          destination: `/`, 
          permanent: false,
        },
      };
    }
  
    const data = await fetchStandardPageData(
      {
        content: {
          page: { key: `${localePrefix}rolex/map-store-details` },
        },
      },
      context
    );
  
    return {
      props: {
        ...data,
        selectedStore: id,
        mapView: mapView === 'true',
        isCPOPage: isCPOPage
      },
    };
  }


export default function RolexMapStoreDetails(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { selectedStore, mapView, isCPOPage, content } = props;

    return (
        <>
        <div className="main-content">
            <RolexMapStoreDetailsPageContent store={selectedStore} mapViewOn={mapView} content={isCPOPage === 'true' ? content.page.components[1] : content.page.components[0]} />
        </div>
        </>
    );
}

RolexMapStoreDetails.Layout = Layout;
