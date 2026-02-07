import React, { useEffect } from "react";

import fetchStandardPageData from "@utils/cms/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { BookAppointmentProvider } from "@contexts/bookAppointmentContext";
import { BookAnAppointment } from "@components/module";
import Layout from "@components/layout";
import ConfirmationAppointment from "@components/module/bookAnAppointment/confirmationAppointment";
import compact from "lodash/compact";
import ContentBlock from "@components/module/contentBlock";
import MobileHeaderClose from "@components/module/bookAnAppointment/mobileHeaderClose";
import { useDeviceWidth } from "@utils/useCustomHooks";

// Function to clear local storage items
const clearLocalStorageItems = () => {
  const itemsToRemove = [
    "completedSteps",
    "currentStep",
    "formattedDate",
    "schedulingUrl",
    "selectedCard",
    "selectedDate",
    "selectedStore",
    "selectedTime",
    "isFromPdp"
  ];

  itemsToRemove.forEach((item) => {
    localStorage.removeItem(item);
  });
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await fetchStandardPageData(
    {
      content: {
        page: { key: "book-an-appointment/confirmation" },
      },
    },
    context
  );

  //console.log("data", data);

  return {
    props: {
      ...data,
    },
  };
}

export default function BookAnAppointmentPage({
  content,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    clearLocalStorageItems();
  }, []);

  const isDesktop = useDeviceWidth()[0];


  return (
    <BookAppointmentProvider>
      <div className="main-content">
        {!isDesktop && <MobileHeaderClose url={"/"} />}
        {compact(content?.page?.components).map((content) => (
          <ContentBlock content={content} key={content?._meta.deliveryId} />
        ))}
      </div>
    </BookAppointmentProvider>
  );
}

BookAnAppointmentPage.Layout = Layout;
