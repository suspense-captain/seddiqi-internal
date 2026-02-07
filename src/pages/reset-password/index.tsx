import Layout from "@components/layout";
import ResetPassword from "@components/module/authenticaion/resetPassword";
import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
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

export default function ResetPasswordPage() {
  return (
    <div>
      <ResetPassword
        title={"Reset your password"}
        subTitle={"Please write a new password, the password must contain:"}
        step={3}
        btnTitle="Reset Password"
      />
    </div>
  );
}

ResetPasswordPage.Layout = Layout;
