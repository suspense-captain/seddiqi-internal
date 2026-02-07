interface Step {
  title?: string;
  buttonText?: string;
}

export interface StepsContent {
  first: Step;
  second: Step;
  third: Step;
  forth: Step;
  fifth: Step;
  other: {
    returnButtonText: string;
  };
}
export interface BookAppointmentContextProps {
    selectedCard: any;
    setSelectedCard: (card: any) => void;
    selectedBrands: any[];
    setSelectedBrands: (brands: any[]) => void;
    completedSteps: boolean[];
    setCompletedSteps: (steps: boolean[]) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    handleStepChange: (step: number) => void;
    markStepCompleted: () => void;
    updateStep: (stepNumber: number, isCompleted: boolean) => void;
    selectedWatches: any[];
    setSelectedWatches: (watches: any[]) => void;
    selectedJewellery: any[];
    setSelectedJewellery: (jewellery: any[]) => void;
    selectedStore: any; 
    setSelectedStore: (store: any) => void;
    productDetails?:any[];
    selectedDate: any | null;
    setSelectedDate: (date: any | null) => void;
    selectedTime: string | null;
    setSelectedTime: (time: string | null) => void;
    schedulingUrl: URL;
    setSchedulingUrl: (url: URL | null) => void;
    isPreviousStepEdited: boolean;
    setIsPreviousStepEdited: (edited: boolean) => void;
    stores: any[];
    setStores: (stores: any[]) => void;
    cities: any[];
    setCities: (cities: any[]) => void;
    stepsContent: StepsContent
    handleCheckboxChange: (itemName: string, categoryType: string) => void;
    isFromPdp: string | null;
    isFromStoreLocatorPdp: string | null;
    setIsFromPdp: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  
