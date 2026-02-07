import { useState, useEffect, type MutableRefObject } from "react";
import { useScrollStore } from "@contexts/scrollProviderContext";
import { useInView } from "framer-motion";
import type { WindowDimensions } from "./useWindowDimensions";

/**
 * Provides a React hook to observe when a referenced DOM element intersects the viewport and dynamically adds or removes function to be executed on scroll to a global `ScrollListener` component.
 *
 * @param ref - A React ref object targeting the DOM element to observe. Must be a mutable ref object pointing to an HTMLDivElement or null.
 * @param onScroll - A callback function invoked when the observed element intersects the viewport or the specified ancestor element. Executed with dynamic `height` and `width` parameters which are provided by `ScrollListener` component. The `onScroll` function MUST be wrapped with a `useCallback`.
 *
 * Uses the lightweight {@link https://docs.pmnd.rs/zustand/getting-started/introduction | zustand state manager} and `useInView` hook from {@link https://www.framer.com/motion/use-in-view/ |framer motion}.
 *
 * @returns Nothing. The hook manages side effects internally via the useEffect lifecycle method.
 *
 * @example
 * // Basic usage example
 * ```tsx
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   const onScroll = useCallback(
 *      ({ height, width }: {height: number | null, width: number | null}) => {
 *        if (!ref.current || !height || !width) return;
 *
 *        // do something on scroll...
 *      },
 *      [ref] // dependencies that when changed, trigger change of the memoized version of the callback
 *   );
 *
 *   useGlobalScroll(ref, onScroll);
 *
 *   return <div ref={ref}>Am animated on scroll when I am in the viewport!</div>;
 * };
 * ```
 */
export function useGlobalScroll(
  ref: MutableRefObject<HTMLDivElement | null>,
  onScroll: ({ height, width }: WindowDimensions) => void
) {
  const { addScrollFn, removeScrollFn } = useScrollStore(state => state);
  const [id] = useState(crypto.randomUUID());
  const isInView = useInView(ref, { once: false, margin: "50% 0px" });

  useEffect(() => {
    if (isInView) {
      addScrollFn({ id: id, fn: onScroll });
    } else {
      removeScrollFn(id);
    }

    return () => {
      removeScrollFn(id);
    };
  }, [isInView, id, onScroll]);
}
