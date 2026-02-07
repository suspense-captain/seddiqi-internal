const RolexMapPoint = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    className={className}
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 4.55556L6.07547 5L6.5283 9L10 1L2 4.55556Z"
      fill="#212121"
      stroke="#212121"
    />
  </svg>
);

export default RolexMapPoint;
