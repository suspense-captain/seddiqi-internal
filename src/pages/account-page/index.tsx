import React from "react";

import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AccountPage from "@components/rendering/accountPage";
import Layout from "@components/layout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: "account-page" },
      },
    },
    context
  );

  return {
    props: {
      ...data,
    },
  };
}

export default function Index({ content }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <AccountPage />;
};

Index.Layout = Layout;
