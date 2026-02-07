import { useState, useEffect } from "react";

export interface WindowDimensions {
  width: number | null;
  height: number | null;
}

export function useWindowDimensions(): WindowDimensions {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions(): WindowDimensions {
    return {
      width: hasWindow ? window.innerWidth : null,
      height: hasWindow ? window.innerHeight : null
    };
  }

  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
