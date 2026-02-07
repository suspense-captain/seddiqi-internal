import { useEffect, useRef } from "react";

const useCloseOnScroll = (isCardOpen, setCardOpen) => {
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isCardOpen && window.scrollY > prevScrollY.current) {
        setCardOpen(null);
      }
      prevScrollY.current = window.scrollY;
    };

    if (isCardOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCardOpen, setCardOpen]);
};

export default useCloseOnScroll;
