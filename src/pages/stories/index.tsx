import { useEffect, useState} from "react";
import { SearchProvider } from "@contexts/searchContext";
import { PlpContent, Search, ViewAllStories } from "@components/module";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { getSearchSuggestions } from "@utils/sfcc-connector/dataService";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { isEmpty } from "@utils/helpers";
import Layout from "@components/layout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { recommendations } = context.query;
  let storiesResults = [];
  if (Array.isArray(recommendations)) {
    storiesResults = JSON.parse(decodeURIComponent(recommendations[0]));
  } else if (typeof recommendations === "string") {
    storiesResults = JSON.parse(decodeURIComponent(recommendations));
  }
  
  const data = await fetchStandardPageData(
      {
          content: {
              page: { key: "/" },
          },
      },
      context
  );

  return {
      props: {
          ...data,
          storiesResults

      },
  };
}



export default function StoriesPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const storiesResults = JSON.parse(sessionStorage.getItem("storiesResults") || "[]");
  const [storiesResults, setStoriesResults] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResults = sessionStorage.getItem("storiesResults");
      if (storedResults) {
        setStoriesResults(JSON.parse(storedResults));
      }
    }
  }, []);

  // const { storiesResults } = props;

  return (
    <div className="main-content">
      <ViewAllStories storiesResults={storiesResults} />
    </div>
  );
};


StoriesPage.Layout = Layout;