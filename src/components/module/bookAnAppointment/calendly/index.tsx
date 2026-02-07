import { useEffect } from "react";

const CalendlyPopup = ({ schedulingWidgetUrl }) => {
  useEffect(() => {
    if (schedulingWidgetUrl && window.Calendly) {
      window.Calendly.initPopupWidget({ url: schedulingWidgetUrl });
    }
  }, [schedulingWidgetUrl]);

  return null; // No UI rendered
};

export default CalendlyPopup;
