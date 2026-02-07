const ArrowRight = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <mask id="path-1-inside-1_29_6412" fill="white">
      <path d="M0 12L6 6L0 0" />
    </mask>
    <path
      d="M6 6L6.70711 6.70711V5.29289L6 6ZM0.707107 12.7071L6.70711 6.70711L5.29289 5.29289L-0.707107 11.2929L0.707107 12.7071ZM6.70711 5.29289L0.707107 -0.707107L-0.707107 0.707107L5.29289 6.70711L6.70711 5.29289Z"
      fill={fill ?? "#032715"}
      mask="url(#path-1-inside-1_29_6412)"
    />
  </svg>
);

export default ArrowRight;
