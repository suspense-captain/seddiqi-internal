import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.scss";
import SelectedCard from "../selectedCard";
import SelectedBrands from "../selectedBrands";
import SelectedLocation from "../selectedLocation";
import ContactInformation from "../contactInformation";
import BookingDetails from "../bookingDetails";
import { Button } from "@components/module";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import router from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import CalendlyPopup from "../calendly";

const StepFive = () => {
  const { 
    selectedStore, 
    selectedTime, 
    selectedDate, 
    schedulingUrl,
    stepsContent
  } = useContext(BookAppointmentContext);
  const userSession = useSession();
  const [disabled, setDisabled] = useState(true);
  const [schedulingWidgetUrl, setSchedulingWidgetUrl] = useState(null);

  useEffect(() => {
    if (selectedStore && selectedTime && selectedDate) {
      setDisabled(false);
    } 
  }, [selectedStore, selectedTime, selectedDate]);

  useEffect(() => {
    // Load Calendly CSS if not already loaded
    if (!document.querySelector("link[href='https://assets.calendly.com/assets/external/widget.css']")) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // Check if script already exists
    if (!document.querySelector("script[src='https://assets.calendly.com/assets/external/widget.js']")) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("schedulingUrl", JSON.stringify(schedulingUrl));

    const isCalendlyEvent = (e: MessageEvent) => {
      const data = e.data;
      // Ensure e.data and e.data.event exist before trying to access properties
      return data && data.event && data.event.indexOf("calendly") === 0 && data.payload && Object.keys(data.payload).length > 0;
    };
  
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (isCalendlyEvent(e)) {
        setTimeout(() => {
          window.Calendly.closePopupWidget();
          router.push("/book-an-appointment/confirmation");
        }, 3000);
      }
    };
  
    window.addEventListener("message", handleCalendlyEvent);
  
    return () => {
      window.removeEventListener("message", handleCalendlyEvent);
    };
  }, []);
  

  const handleBookingRequest = () => {
    const userAuthenticated = userSession.data?.user;
  
    if (userAuthenticated) {
      const schedulingWidgetUrl = `${schedulingUrl}?name=${userAuthenticated?.firstName}&email=${userAuthenticated?.email}`;
      setSchedulingWidgetUrl(schedulingWidgetUrl);
    }
  };

  return (
    <div className={styles.dateSelector}>
      <div className={styles.selectedData}>
        <SelectedCard />
        <SelectedBrands />
        <SelectedLocation />
        <BookingDetails />
        <ContactInformation />
      </div>
      <div className={styles.buttonContainer}>
        <Button 
          title={stepsContent.fifth.buttonText} 
          disabled={disabled} 
          color="metallic" 
          type="solid" 
          clickHandler={handleBookingRequest} 
        />
      </div>
      <CalendlyPopup schedulingWidgetUrl={schedulingWidgetUrl}/>
    </div>
  );
};

export default StepFive;
