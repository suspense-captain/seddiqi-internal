const GreenArrowSmall = ({ fill, className }: { fill?: string; className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="5" height="10" viewBox="0 0 5 10" fill="none">
    <mask id="path-1-inside-1_1586_22511" fill="white">
      <path d="M0 10L5 5L0 0" />
    </mask>
    <path
      d="M5 5L6.06066 6.06066V3.93934L5 5ZM1.06066 11.0607L6.06066 6.06066L3.93934 3.93934L-1.06066 8.93934L1.06066 11.0607ZM6.06066 3.93934L1.06066 -1.06066L-1.06066 1.06066L3.93934 6.06066L6.06066 3.93934Z"
      fill="#147749"
      mask="url(#path-1-inside-1_1586_22511)"
    />
  </svg>
);

export default GreenArrowSmall;
