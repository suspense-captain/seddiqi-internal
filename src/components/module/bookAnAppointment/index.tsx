import { useContext, useEffect } from "react";
import styles from "./bookAnAppointment.module.scss";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import { CloseIconV2 } from "@assets/images/svg";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import StepFour from "./stepFour";
import StepFive from "./stepFive";
import ExclusiveInfoCards from "./exclusiveInfoCards";

const BookAnAppointment = ({ content, exclusiveInfoCards = null }) => {
  const { 
      completedSteps, 
      currentStep, 
      setIsPreviousStepEdited,
      handleStepChange,
      setCompletedSteps,
      setSelectedCard,
      selectedWatches,
      isFromPdp,
      isFromStoreLocatorPdp
    } = useContext(BookAppointmentContext);


  //Checks if the user is coming from PDP
  useEffect(() => {
    const savedPreviousPage = isFromPdp;    
    const fromStoreLocatorPdp = isFromStoreLocatorPdp;

    if(savedPreviousPage){
      handleStepChange(3);
      setCompletedSteps([true, true, false, false, false]);
      setSelectedCard(content?.page?.setpOne.listItems[0]);
      localStorage.removeItem("isFromPdp");
    }
    else if(fromStoreLocatorPdp){
      handleStepChange(4);
      setCompletedSteps([true, true, true, false, false]);
      setSelectedCard(content?.page?.setpOne.listItems[0]);
      localStorage.removeItem("isFromStoreLocatorPdp");
    }

  }, []);

  const steps = [1, 2, 3, 4, 5];
  const stepOne = content?.page?.setpOne;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne content={stepOne} />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
      default:
        return <div>Invalid step</div>;
    }
  };

  const infoCards = exclusiveInfoCards?.content?.page;

  const handleStepBackClick = (index) => {
  // Update completedSteps based on the clicked index
  const updatedCompletedSteps = [...completedSteps];

  // Loop through completedSteps and set values to true for the steps that are before the clicked index
  for (let i = 0; i <= index; i++) {
    updatedCompletedSteps[i] = true;
  }

  // After the loop, mark the current step as true and the rest as false
  for (let i = index + 1; i < updatedCompletedSteps.length; i++) {
    updatedCompletedSteps[i] = false;
  }

  // Update the state with the new completedSteps
  setCompletedSteps(updatedCompletedSteps);

  // Proceed with the step change
  if (updatedCompletedSteps[index]) {
    handleStepChange(index + 1);
    setIsPreviousStepEdited(true);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.title}>Book an appointment</div>
        <CloseIconV2 />
      </div>

      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumb}>
        {steps.map((step, index) => (
          <div key={index} className={styles.breadcrumbItem}>
            <div>
              <span onClick={() => handleStepBackClick(index)}
                className={`${styles.circle} ${completedSteps[index] && styles.completed} ${
                  index + 1 === currentStep ? styles.active : ""
                }`}
              >
                {index + 1}
              </span>
            </div>
            {index < steps.length - 1 && <span className={styles.line}></span>}
          </div>
        ))}
      </div>
      <div className={styles.stepContent}>{renderStepContent()}</div>
      {exclusiveInfoCards && <ExclusiveInfoCards {...infoCards} />}
    </div>
  );
};

export default BookAnAppointment;
