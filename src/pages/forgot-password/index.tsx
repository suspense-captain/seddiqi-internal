import Layout from "@components/layout";
import ResetPassword from "@components/module/authenticaion/resetPassword";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext } from "next";
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: "" },
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

export default function ForgotPasswordPage() {
  return (
    <div>
      <ResetPassword title={"Reset your password"} subTitle={"In order to reset your password, please provide us with your email. We will send you an email momentarily. Contact Customer Service for further assistance."} step={1} />
    </div>
  );
}

ForgotPasswordPage.Layout = Layout;
