import Layout from "@components/layout";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext } from "next";
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: "/" },
      },
    },
    context,
  );

  return {
    props: {
      ...data,
    },
  };
}

const TestPage = () => {
  return <div>TestPage</div>;
};

TestPage.Layout = Layout;

export default TestPage
