"use client";
import { create } from "zustand";
import { scroll } from "framer-motion";
import { useWindowDimensions, WindowDimensions } from "@utils/useCustomHooks";
import { useEffect } from "react";

export type ScrollFn = {
  id: string;
  fn: (dimensions: WindowDimensions) => void;
};

const addScrollFn = (scrollFns: ScrollFn[], newScrollFn: ScrollFn) => [...scrollFns, newScrollFn];

const removeScrollFn = (scrollFns: ScrollFn[], id: string) => scrollFns.filter(scrollFn => scrollFn.id !== id);

const updateScrollFn = (scrollFns: ScrollFn[], id: string, newFn: () => void) =>
  scrollFns.map(scrollFn => (scrollFn.id === id ? { ...scrollFn, fn: newFn } : scrollFn));

type ScrollStore = {
  scrollFns: ScrollFn[];
  setScrollFns: (scrollFns: ScrollFn[]) => void;
  addScrollFn: (newScrollFn: ScrollFn) => void;
  removeScrollFn: (id: string) => void;
  updateScrollFn: (id: string, newFn: () => void) => void;
};

export const useScrollStore = create<ScrollStore>(
  (set): ScrollStore => ({
    scrollFns: [],
    setScrollFns: (scrollFns: ScrollFn[]) =>
      set(state => ({
        ...state,
        scrollFns
      })),

    // Actions
    addScrollFn: (newScrollFn: ScrollFn) => {
      set(state => ({
        ...state,
        scrollFns: addScrollFn(state.scrollFns, newScrollFn)
      }));
    },
    removeScrollFn: (id: string) => {
      set(state => ({
        ...state,
        scrollFns: removeScrollFn(state.scrollFns, id)
      }));
    },
    updateScrollFn: (id: string, newFn: () => void) =>
      set(state => ({
        ...state,
        scrollFns: updateScrollFn(state.scrollFns, id, newFn)
      }))
  })
);

/**
 * Component that uses `scroll` function from framer motion to {@link https://www.framer.com/motion/scroll-function/ | Create high performance scroll-linked animations.}
 *
 * `scroll` function uses {@link https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline | ScrollTimeline API} if browser supports it to achieve {@link https://developer.chrome.com/blog/scroll-animation-performance-case-study | maximal performance for scroll driven animations}.
 * If the browser does not support ScrollTimeline API, then a regular scroll event listener is used.
 *
 * Functions are dynamically added and removed to the callback parameter of the `scroll` function using the lightweight {@link https://docs.pmnd.rs/zustand/getting-started/introduction | zustand state manager} which adds only 1.88KB to bundle size. This way we only have a single scroll event listener for the whole website.
 *
 * @author Stefan Stoilov
 */
export default function ScrollListener() {
  const { scrollFns } = useScrollStore(state => state);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    const cancel = scroll(() => {
      scrollFns.forEach(({ fn }) => {
        fn(dimensions);
      });
    });

    return () => {
      cancel();
    };
  }, [scrollFns]);

  return <></>;
}
