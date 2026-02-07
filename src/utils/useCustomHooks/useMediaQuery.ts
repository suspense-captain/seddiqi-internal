import { useState, useEffect, useMemo } from "react";

export type BreakpointsValuesType = {
  S: number;
  M: number;
  L: number;
  XL: number;
};

type MaxWidthType = `(max-width: ${number}px)`;
type MinWidthType = `(min-width: ${number}px)`;

export type MinWidthBreakpointsType = Record<keyof BreakpointsValuesType, MinWidthType>;
export type MaxWidthBreakpointsType = Record<keyof BreakpointsValuesType, MaxWidthType>;

// WARNING - breakpoints have to match values inside _screensizes.scss
export const breakpoints: BreakpointsValuesType = {
  S: 551,
  M: 801,
  L: 1024,
  XL: 1920
};

export const maxWidth: MaxWidthBreakpointsType = {
  S: `(max-width: ${breakpoints.S}px)`,
  M: `(max-width: ${breakpoints.M}px)`,
  L: `(max-width: ${breakpoints.L}px)`,
  XL: `(max-width: ${breakpoints.XL}px)`
};

export const minWidth: MinWidthBreakpointsType = {
  S: `(min-width: ${breakpoints.S + 1}px)`,
  M: `(min-width: ${breakpoints.M + 1}px)`,
  L: `(min-width: ${breakpoints.L + 1}px)`,
  XL: `(min-width: ${breakpoints.XL + 1}px)`
};

export function useMediaQuery(query: { type: "min" | "max"; breakpoint: keyof BreakpointsValuesType }) {
  const [breakpointMatched, setBreakpointMatched] = useState(false);

  const mediaQuery = useMemo(
    () => (query.type === "max" ? maxWidth[query.breakpoint] : minWidth[query.breakpoint]),
    [query]
  );

  useEffect(() => {
    const mediaQueryHandler = (event: MediaQueryListEvent) => {
      setBreakpointMatched(event.matches);
    };

    if (window.matchMedia(mediaQuery).matches) {
      setBreakpointMatched(true);
    }

    window.matchMedia(mediaQuery).addEventListener("change", mediaQueryHandler);

    return () => {
      window.matchMedia(mediaQuery).removeEventListener("change", mediaQueryHandler);
    };
  }, [mediaQuery]);

  return [breakpointMatched];
}
