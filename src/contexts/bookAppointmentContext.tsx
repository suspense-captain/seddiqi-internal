import { BookAppointmentContextProps, StepsContent } from "@utils/models/bookAnAppointment";
import React, { createContext, useState, useEffect, useContext } from "react";

export const BookAppointmentContext = createContext<BookAppointmentContextProps | undefined>(undefined);

export const useBookAppointmentContext = () => {
  const context = useContext(BookAppointmentContext);
  if (!context) {
    throw new Error("useBookAppointmentContext must be used within a BookAppointmentProvider");
  }
  return context;
};

const initialStepContent: StepsContent = {
  first: { 
    title: "Step 1", 
    buttonText: null 
  },
  second: { 
    title: "Step 2", 
    buttonText: "Proceed to the next step" 
  },
  third: { 
    title: "Step 3", 
    buttonText: "Select Boutique" 
  },
  forth: { 
    title: "Step 4", 
    buttonText: "Next"
  },
  fifth: { 
    title: "Step 5", 
    buttonText: "Request Booking" 
  },
  other: {
    returnButtonText: 'Save Changes'
  }
};

export const BookAppointmentProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState<any[]>([]);
  const [selectedWatches, setSelectedWatches] = useState<any[]>([]);
  const [selectedJewellery, setSelectedJewellery] = useState<any[]>([]);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [currentStep, setCurrentStep] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [schedulingUrl, setSchedulingUrl] = useState(null);
  const [isPreviousStepEdited, setIsPreviousStepEdited] = useState(false);
  const [stores, setStores] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [stepsContent, setStepsContent] = useState<StepsContent>(null);
  const [isFromPdp, setIsFromPdp] = useState<string | null>(null);
  const [isFromStoreLocatorPdp, setIsFromStoreLocatorPdp] = useState<string | null>(null);

  // Handle Step Change
  const handleStepChange = (step: number) => {
    localStorage.setItem("currentStep", JSON.stringify(step));
    setCurrentStep(step);
  };

  const markStepCompleted = () => {
    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[currentStep - 1] = true;
      return updated;
    });
  };

  const updateStep = (stepNumber: number, isCompleted: boolean) => {
    if (stepNumber < 1 || stepNumber > completedSteps.length) {
      //console.error("Invalid step number");
      return;
    }

    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[stepNumber - 1] = isCompleted;
      localStorage.setItem("completedSteps", JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckboxChange = (itemName: string, categoryType: string) => {
    if (categoryType === "jewellery") {
      const isSelected = selectedJewellery.includes(itemName);
      const updatedJewellery = isSelected
        ? selectedJewellery.filter((item) => item !== itemName)
        : [...selectedJewellery, itemName];

      if (updatedJewellery.length !== selectedJewellery.length) {
        setSelectedJewellery(updatedJewellery);
        localStorage.setItem("selectedJewellery", JSON.stringify(updatedJewellery));
      }
    } else {
      // categoryType === "watches"
      const isSelected = selectedWatches.includes(itemName);
      const updatedWatches = isSelected
        ? selectedWatches.filter((item) => item !== itemName)
        : [...selectedWatches, itemName];

      if (updatedWatches.length !== selectedWatches.length) {
        setSelectedWatches(updatedWatches);
        localStorage.setItem("selectedWatches", JSON.stringify(updatedWatches));
      }
    }
  };

  const parseFromLocalStorage = (key: string, fallback: any) => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
      }
    }
    return fallback;
  };

  useEffect(() => {
    const savedStep = JSON.parse(localStorage.getItem("currentStep")) || 1;
    const savedCompletedSteps = JSON.parse(localStorage.getItem("completedSteps")) || [false, false, false, false, false];
    const savedSelectedCard = JSON.parse(localStorage.getItem("selectedCard") || null);
    const savedWatches = JSON.parse(localStorage.getItem("selectedWatches") || '[]');
    const savedJewellery = JSON.parse(localStorage.getItem("selectedJewellery") || '[]');
    const savedStore = JSON.parse(localStorage.getItem("selectedStore")) || null;
    const savedSelectedDate = parseFromLocalStorage("selectedDate", null);
    const savedSelectedTime = parseFromLocalStorage("selectedTime", null);
    const savedIsFromPdp = JSON.parse(localStorage.getItem("isFromPdp")) || null;
    const savedIsFromStoreLocatorPdp = JSON.parse(localStorage.getItem("isFromStoreLocatorPdp")) || null;
    const savedSchedulingUrl = JSON.parse(localStorage.getItem("schedulingUrl")) || null;

    if (savedStep) {
      localStorage.setItem("currentStep", savedStep);
      setCurrentStep(Number(savedStep));
    } else {
      localStorage.setItem("currentStep", savedStep);
      setCurrentStep(1);
    }

    if (savedCompletedSteps) {
      setCompletedSteps(savedCompletedSteps);
    }

    if (savedSelectedCard) {
      setSelectedCard(savedSelectedCard);
    }

    if (savedWatches) {
      setSelectedWatches(savedWatches);
    }

    if (savedJewellery) {
      setSelectedJewellery(savedJewellery);
    }

    if (savedStore) {
      setSelectedStore(savedStore);
    }

    if (savedSelectedDate) {
      setSelectedDate(new Date(savedSelectedDate));
    }

    if (savedSelectedTime) {
      setSelectedTime(savedSelectedTime);
    }

    if (savedIsFromPdp) {
      setIsFromPdp(savedIsFromPdp);
    }

    if (savedIsFromStoreLocatorPdp) {
      setIsFromStoreLocatorPdp(savedIsFromStoreLocatorPdp);
    }

    if (savedSchedulingUrl) {
      setSchedulingUrl(savedSchedulingUrl);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCard) {
      localStorage.setItem("selectedCard", JSON.stringify(selectedCard));
    }
  }, [selectedCard]);

  // When selectedCard changes, mark the first step as completed
  useEffect(() => {
    if (selectedCard) {
      setCompletedSteps((prev) => {
        const updated = [...prev];
        updated[0] = true;
        return updated;
      });
    }
  }, [selectedCard]);

  // Please don't delete the commented codes below. Might need this later on
  // Handle the router events to track the previous page URL
  /*useEffect(() => {
    if(window.location.href.includes("/product/")){
      const currentPage = window.location.href;
      localStorage.setItem("isFromPdp", JSON.stringify(currentPage));
    }
  }, [isFromPdp]);*/

  useEffect(() => {
    // TODO: Fetch steps content from CMS
    setStepsContent(initialStepContent);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BookAppointmentContext.Provider
      value={{
        selectedCard,
        setSelectedCard,
        selectedBrands,
        setSelectedBrands,
        completedSteps,
        setCompletedSteps,
        currentStep,
        setCurrentStep,
        handleStepChange,
        markStepCompleted,
        updateStep,
        selectedWatches,
        setSelectedWatches,
        selectedJewellery,
        setSelectedJewellery,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        selectedStore,
        setSelectedStore,
        schedulingUrl,
        setSchedulingUrl,
        isPreviousStepEdited,
        setIsPreviousStepEdited,
        stores,
        setStores,
        cities,
        setCities,
        stepsContent,
        handleCheckboxChange,
        // productDetails,
        isFromPdp,
        isFromStoreLocatorPdp,
        setIsFromPdp
      }}
    >
      {children}
    </BookAppointmentContext.Provider>
  );
};
