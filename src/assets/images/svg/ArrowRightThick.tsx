import React from "react";

const ArrowRightThick = ({ fill, className }: { fill?: string; className?: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path
        d="M6 5L5.13333 5.93333L1.06667 10L0.0666666 9L4.13333 4.93333L0 0.933333L1 0L5.06667 4.06667L6 5Z"
        fill="white"
      />
    </svg>
  );
};

export default ArrowRightThick;
