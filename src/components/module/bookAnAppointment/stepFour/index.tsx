import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./index.module.scss";
import { ArrowRight } from "@assets/images/svg";
import TabbedNavigation from "@components/module/tabbedNavigation";
import SelectedCard from "../selectedCard";
import SelectedLocation from "../selectedLocation";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import SelectedBrands from "../selectedBrands";
import SignIn from "@components/module/authenticaion/signIn";
import Register from "@components/module/authenticaion/register";
import { Button, Loader } from "@components/module";
import ContactInformation from "../contactInformation";
import { CalendlyResponse, EventType } from "@pages/api/calendly/types";
import { Swiper, SwiperSlide } from 'swiper/react';

import { FreeMode } from 'swiper/modules';
import { useSession } from "next-auth/react";

const getAvailableDates = (month, year, availableDays = []) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDates = [];
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    let isAvailable = date.getDay() !== 0 && date.getDay() !== 6 && date >= today;

    if (availableDays.length) {
      isAvailable = availableDays.includes(day);
    }
    
    availableDates.push({
      day: date.toLocaleString("default", { weekday: "short" }),
      date: day,
      available: isAvailable,
      fullDate: date,
    });
  }

  return availableDates;
};

const getEventTypeByStoreName = async (storeName: string): Promise<EventType> => {
  let url = "/api/calendly/event/types?count=100";

  while (url) {
    const response = await fetch(url);
    const { collection, pagination }: CalendlyResponse<EventType> = await response.json();
    const eventExist = collection.find((event) => event.name.toLowerCase().trim() === storeName.toLowerCase().trim());

    if (eventExist) {
      return eventExist;
    }

    url = pagination.next_page ? `/api/calendly/event/types?pagination=${encodeURIComponent(pagination.next_page)}` : null;
  }
};

const getAvailableTimeSlotsForMonth = async (currentMonth, currentYear, storeName) => {
  const event = await getEventTypeByStoreName(storeName);
  const eventURI = event.uri;
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  const today = new Date();
  let startDate = new Date(currentYear, currentMonth, 1);
  let allSlots = [];

  if (startDate <= today) {
    startDate = new Date();
    startDate.setDate(today.getDate() + 1);
  }

  while (startDate <= firstDayOfNextMonth) {
      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      if (endDate > firstDayOfNextMonth) {
          endDate = new Date(firstDayOfNextMonth);
      }

      const query = `?eventURI=${eventURI}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;
      allSlots.push(fetch(`/api/calendly/event/availableSlots${query}`).then(res => res.json()));
      startDate.setDate(startDate.getDate() + 7);
  }

  const availabilityResponses = await Promise.all(allSlots);
  
  const allAvailableSlots = availabilityResponses.flatMap(res => res.collection || []);

  const formatDateTime = (isoString) => {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
  };

  const groupedSlots = allAvailableSlots.reduce((acc, slot) => {
      const { date, time } = formatDateTime(slot.start_time);
      if (!acc[date]) {
          acc[date] = [];
      }

      const timeObj = {
        time,
        schedulingUrl: slot.scheduling_url
      }
      acc[date].push(timeObj);
      return acc;
  }, {});
  const datesWithSlots = Object.entries(groupedSlots).map(([date, slots]) => ({ date, slots }));
  const daysWithSlots = datesWithSlots.map((item,index) => {
    return { day: parseInt(item.date.split('/')[0], 10), slots: item.slots}
  });
  const availableDaysArray = datesWithSlots.map(item => parseInt(item.date.split('/')[0], 10));
  const availableDays = availableDaysArray.length ? availableDaysArray : [-1];
  const final = { 
    slots: daysWithSlots,
    dates: getAvailableDates(currentMonth, currentYear, availableDays)
  };

  return final;
};

const tabs = [
  {
    id: 1,
    title: "Sign In",
    content: <SignIn />,
  },
  {
    id: 2,
    title: "Register",
    content: <Register hideTabbedNavigation={false} />,
  },
];

const PREFERENCE = {
  OPEN: "open",
  INTERESTED: "interested"
}

const StepFour = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    selectedTime,
    setSelectedTime,
    selectedStore, 
    setSchedulingUrl,
    updateStep, 
    handleStepChange,
    isPreviousStepEdited,
    setIsPreviousStepEdited,
    stepsContent,
  } = useContext(BookAppointmentContext);
  const userSession = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [noSlotsMessage, setNoSlotsMessage] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState(null); 
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);

  const dateContainerRef = useRef(null);
  const timeContainerRef = useRef(null);

  const swiperRef = useRef(null); // Create a ref for Swiper
  const swiperTimeRef = useRef(null); // Create a ref for Swiper

  useEffect(() => {
    const disable = !(selectedDate && selectedTime && userSession.data?.user);
    setDisabled(disable);
  }, [selectedDate, selectedTime, userSession.data?.user]);

  useEffect(() => {
    setLoading(true);
    const monthExists = slots.find(slot => slot.month === currentMonth);
  
    if (monthExists) {
      const firstAvailableDay = monthExists.dates.find(date => date.available);
      setSelectedDate(firstAvailableDay || {});
      setNoSlotsMessage(!firstAvailableDay);
      setSelectedTime(monthExists.slots[0]?.slots[0].time || null);
      setSchedulingUrl(monthExists.slots[0]?.slots[0].schedulingUrl || null)
      setLoading(false);
      return;
    }
  
    const fetchSlots = async () => {
      try {
        const { slots: newSlots, dates } = await getAvailableTimeSlotsForMonth(currentMonth, currentYear, selectedStore?.name);
        const firstAvailableDay = dates.find(day => day.available);
        const availableSlots = newSlots[0]?.slots;
  
        setSelectedDate(firstAvailableDay);
        setNoSlotsMessage(!availableSlots);
        setSlots(prevSlots => [...prevSlots, { month: currentMonth, slots: newSlots, dates }]);
        setSelectedTime(newSlots[0]?.slots[0].time || null);
        setSchedulingUrl(newSlots[0]?.slots[0].schedulingUrl || null)

        localStorage.setItem("selectedDate", JSON.stringify(firstAvailableDay));
        localStorage.setItem("selectedTime", JSON.stringify(newSlots[0]?.slots[0].time) || null);
      } catch (error) {
        //console.error("Error fetching available time slots", error);
        setNoSlotsMessage(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSlots();
  }, [currentMonth, currentYear]);

  const handleDateClick = (date) => {
    if (date.available) {
      setSelectedDate(date);
      setSelectedTime(null);

      localStorage.setItem("selectedDate", JSON.stringify(date));
    }
  };

  const handleMonthChange = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.destroy(true, true);
    }

    const newMonth = direction === "next" ? (currentMonth + 1) % 12 : (currentMonth + 11) % 12;
    const isYearChange = (direction === "next" && currentMonth === 11) || (direction === "prev" && currentMonth === 0);
    const yearOffset = isYearChange ? (direction === "next" ? 1 : -1) : 0;

    setCurrentMonth(newMonth);
    setCurrentYear(currentYear + yearOffset);    
  };

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance) {
      swiperInstance.update();
    }
  }, [currentMonth, currentYear]);

  const handleTimeClick = (time) => {
    localStorage.setItem("selectedTime", time);
    setSelectedTime(time);
  };

  const handleOptionChange = (event) => {
    setSelectedPreference(event.target.value);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      const schedulingUrl = Array.from(slots)
        .find(slot => slot.month === currentMonth)
        ?.slots.find(slot => slot.day === selectedDate.date)
        ?.slots.find(slot => slot.time === selectedTime).schedulingUrl;

      setSchedulingUrl(schedulingUrl);
      updateStep(4, true);
      handleStepChange(5);
      setIsPreviousStepEdited(false);
    }
  };

  const Preferences = () => (
    <div className={styles.preferenceContainer}>
      <div className={styles.heading}>Select your preference</div>
      <div className={styles.options}>
        <label className={styles.customRadio}>
          <input
            type="radio"
            value={PREFERENCE.INTERESTED}
            checked={selectedPreference === PREFERENCE.INTERESTED}
            onChange={handleOptionChange}
          />
          <span
            className={`${styles.radioCircle} ${
              selectedPreference === PREFERENCE.INTERESTED ? styles.selected : styles.notSelected
            }`}
          ></span>
          <span className={selectedPreference === PREFERENCE.INTERESTED ? styles.selectedText : styles.notSelectedText}>
            I am only interested in this product
          </span>
        </label>

        <label className={styles.customRadio}>
          <input
            type="radio"
            value={PREFERENCE.OPEN}
            checked={selectedPreference === PREFERENCE.OPEN}
            onChange={handleOptionChange}
          />
          <span
            className={`${styles.radioCircle} ${selectedPreference === PREFERENCE.OPEN ? styles.selected : styles.notSelected}`}
          ></span>
          <span className={selectedPreference === PREFERENCE.OPEN ? styles.selectedText : styles.notSelectedText}>
            I am open to similar products
          </span>
        </label>
      </div>
    </div>
  );

  const SlotPickerNavigation = () => (
    <div className={styles.header}>
      <div className={styles.h2}>Select a Date & Time</div>
      <div className={styles.monthNav}>
        <button
          className={styles.button}
          onClick={() => handleMonthChange("prev")}
          disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
        >
          <ArrowRight className={styles.arrowLeft} />
        </button>
        <span style={{ width: '8rem'}}>
          {new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long" })} {currentYear}
        </span>
        <button className={styles.button} onClick={() => handleMonthChange("next")}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance) {
      swiperInstance.update();
    }

    // Re-attach wheel scroll event listener after the swiper has been updated
    const swiperContainer = swiperRef.current;
    if (swiperContainer) {
      swiperContainer.addEventListener('wheel', (event) => handleWheelScroll(event, swiperRef), { passive: false });
    }
    return () => {
      if (swiperContainer) {
        swiperContainer.removeEventListener('wheel', (event) => handleWheelScroll(event, swiperRef));
      }
    };
  }, [currentMonth, currentYear]);

  const handleWheelScroll = (event, swiperRef) => {
    event.preventDefault();
  
    if (swiperRef.current) {
      if (event.deltaY > 0) {
        swiperRef.current.swiper.slideNext();
      } else {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };
  
  useEffect(() => {
    const swiperTimeContainer = swiperTimeRef.current;
  
    // Only attach wheel event listener once data is loaded and slots are available
    if (swiperTimeContainer && !loading && !noSlotsMessage) {
      swiperTimeContainer.addEventListener('wheel', (event) => handleWheelScroll(event, swiperTimeRef), { passive: false });
    }
  
    // Clean up event listener on unmount or when loading changes
    return () => {
      if (swiperTimeContainer) {
        swiperTimeContainer.removeEventListener('wheel', (event) => handleWheelScroll(event, swiperTimeRef));
      }
    };
  }, [loading, noSlotsMessage, slots]);


  return (
    <div className={styles.dateSelector}>
      <div className={styles.selectedData}>
        <SelectedCard />
        <SelectedBrands />
        <SelectedLocation />
      </div>

      <SlotPickerNavigation />

      {/* Date Picker with Mouse Scroll */}
      <div className={styles.dateContainer} ref={dateContainerRef}>
        <Swiper 
        key={`${currentMonth}-${currentYear}`}
        slidesPerView={"auto"}
        spaceBetween={10}
        freeMode={true}
        modules={[FreeMode]}
        className={styles.dates}
        ref={swiperRef}
        >
          {(Array.from(slots).find(slot => slot.month === currentMonth)?.dates || getAvailableDates(currentMonth, currentYear, [-1])).map((item) => (
            <SwiperSlide
              key={item.date}
              className={`${styles.dateItem} ${
                selectedDate && selectedDate.date === item.date ? styles.selected : ""
              } ${!item.available ? styles.disabled : ""}`}
              onClick={() => handleDateClick(item)}
            >
              <div className={styles.day}>{item.day}</div>
              <div className={styles.date}>{item.date}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Time Slot Picker with Mouse Scroll */}
      {!noSlotsMessage ?
        <div className={styles.timeContainer} ref={timeContainerRef}>
          {loading ? 
          <Loader localContainerLoading={true} /> :
          noSlotsMessage ? (
            <p>No available time slots for this date.</p>
          ) : (
            <Swiper 
            slidesPerView={"auto"}
            spaceBetween={10}
            freeMode={true}
            loop={false}
            modules={[FreeMode]}
            className={styles.times}
            ref={swiperTimeRef}
            >
              {Array.from(slots).find(slot => slot.month === currentMonth)?.slots?.find(date => date.day === selectedDate.date)?.slots?.map((slot) => (
                <SwiperSlide
                  key={slot.time}
                  className={`${styles.timeItem} ${selectedTime === slot.time ? styles.selectedTime : ""}`}
                  onClick={() => handleTimeClick(slot.time)}
                >
                  {slot.time}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      :
      <div className={styles.timeContainer} ref={timeContainerRef}>
        <div className={styles.noSlotsMessageContainer}>
          <p>No time slots available</p>
        </div>
      </div>
      }

      <Preferences />

      {userSession.data?.user &&
        <ContactInformation />
      }
      
      {userSession.data?.user && !loading &&
        <div className={styles.nextButtonContainer}>
          <Button 
            title={isPreviousStepEdited ? stepsContent.other.returnButtonText : stepsContent.forth.buttonText}
            color="metallic" 
            type="solid" 
            disabled={disabled} 
            clickHandler={handleButtonClick} 
          />
        </div>
      }

      {!userSession.data?.user && <TabbedNavigation gap={0} className={styles.tabNavigation} tabs={tabs} />}
    </div>
  );
};

export default StepFour;
