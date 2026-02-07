
import Layout from "@components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import fetchPageData from "@utils/cms/page/fetchPageData";
import { getLocalePrefix, isEmpty, isKSALocale, mapToID } from "@utils/helpers";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let { slug } = context.params || {};
  const { vse } = context.query || {};
  const localePrefix = getLocalePrefix(context?.locale, context?.defaultLocale);
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: `${localePrefix}category/${slug}` },
      },
    },
    context
  );

  if (isEmpty(data.page) || !slug) {
    return {
      redirect: {
        destination: `/${localePrefix}page-not-found`,
      },
    };
  }

  if (data?.content?.page) {
    data.content.page = null;
  }

  slug = Array.isArray(slug) ? slug.join("/") : slug;
  const props = await fetchPageData(
    {
      content: {
        slots: (data?.content?.page?.slots || []).map(mapToID),
      },
    },
    context
  );

  let category;

  if (!category) {
    if (isKSALocale(context?.locale)) {
      return {
        redirect: {
          destination: '/en-SA',
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

  const products = null;
  category.products = products;

  return {
    props: {
      ...data,
      vse: vse || "",
      category: category,
      slots: props.content.slots,
    },
  };
}


export default function CategoryPage(props: InferGetServerSidePropsType<typeof getServerSideProps> ) {
  const { vse, content, category, slots } = props;
  //   const [config] = useContent(content.configComponents, vse);
  
    // let components: CmsContent[] = props.content?.page?.components || [];
    // let pageSlots: CmsContent[] = slots;
    // let products: Product[] = category?.products;

  return (
    <div className="flex h-screen flex-col justify-between">
      {/* <div className="mx-auto mt-16 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mx-auto flex flex-col sm:flex-row">
          <Image
            alt="coffee"
            className="rounded-lg"
            src={product.imageGroups[0].images[0].link}
            width={560}
            height={640}
          />
          <div className="mt-10 flex flex-col sm:mt-0 sm:ml-10">
            <h1 className="mt-1 text-4xl font-bold uppercase text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">
              {product.name}
            </h1>
            <h1 className="mt-3 text-4xl font-bold text-gray-500 sm:text-3xl sm:tracking-tight lg:text-3xl">
              ${product.price}
            </h1>
            <div className="mt-10 mb-5 border-t border-gray-200 pt-10 font-bold">
              Description
            </div>
            <p className="max-w-xl">{product.longDescription}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

CategoryPage.Layout = Layout;
