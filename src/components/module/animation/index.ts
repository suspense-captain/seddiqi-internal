// Constants for animation props utilized by framer-motion.
// Defined objects are used by framer-motion's "m" components and by useAnimate(),
// Usage of those constants ensures consistency in animation props across the app.
//


export const noOpacity = { opacity: 0 };

export const fullOpacity = { opacity: 1 };

// Default transition
export const transition = {
  duration: 0.3
};

// Fast transition
export const fastTransition = {
  duration: 0.2
};

// Default delay
export const delay = {
  delay: 0.3
};

export const instant = {
  duration: 0
};

// Default transition with delay
export const transitionWithDelay = { ...transition, ...delay };

export const overlayAnimation = {
  initial: noOpacity,
  animate: fullOpacity,
  exit: { opacity: 0, transition: { ...transition, delay: 0.1 } },
  transition
};

export const fadeInAndOut = {
  initial: noOpacity,
  animate: fullOpacity,
  exit: noOpacity,
  transition
};

export const formsFadeInAndOut = {
  initial: noOpacity,
  animate: { opacity: 1, transition: transitionWithDelay },
  exit: noOpacity,
  transition
};
