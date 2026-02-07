import styles from "./bookingDetails.module.scss";
import { useContext } from "react";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import { EditIcon } from "@assets/images/svg";
import Typography from "@components/module/typography";

const ContactInformation = () => {
  const { 
    selectedDate, 
    selectedTime, 
    selectedCard, 
    handleStepChange, 
    updateStep,
  } = useContext(BookAppointmentContext);

const formatDate = (dateString) => {
  if (!dateString) {
    return localStorage.getItem("formattedDate");
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: "long", 
    month: "long", 
    year: "numeric", 
    day: "numeric" 
  };  const formattedDate = date.toLocaleDateString("en-GB", options);
  const day = date.getDate();

  const addOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  const dayWithSuffix = addOrdinalSuffix(day);
  const parts = formattedDate.split(" ");
  
  localStorage.setItem("formattedDate", `${parts[0]}, ${dayWithSuffix} ${parts[2]}, ${parts[3]}`);

  return `${parts[0]}, ${dayWithSuffix} ${parts[2]}, ${parts[3]}`;
};
  
  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <Typography variant="h4">Booking Details</Typography>
        <div
          onClick={() => {
            handleStepChange(4);
            updateStep(4, false);
          }}
        >
          <EditIcon className={styles.editIcon} />
        </div>
      </div>
      <div className={styles.bookingInfo}>
        <ul>
            <li>{formatDate(selectedDate.fullDate)}</li>
            <li>{selectedTime}</li>
            <li>{selectedCard.title}</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInformation;
