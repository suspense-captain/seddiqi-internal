const Tick = ({ fill, className }: { fill?: string; className?: string }) => (
  <svg
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}

  >
    <path
      d="M11 1L3.40682 8.59319L1 6.18637"
      stroke="black"
      stroke-width="1.28273"
    />
  </svg>
);

export default Tick;
