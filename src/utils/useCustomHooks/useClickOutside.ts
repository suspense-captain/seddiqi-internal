import { useEffect } from "react";

const useClickOutside = (handleCardToggle, className) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.classList[0]?.includes(className)) {
        if(handleCardToggle) {
          handleCardToggle(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCardToggle]);
};

export default useClickOutside;
