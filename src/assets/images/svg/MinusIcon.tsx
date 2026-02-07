const MinusIcon = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#C5B5A3" />
    <path d="M26 20L19.9598 20L14 20" stroke="white" stroke-miterlimit="10" />
  </svg>
);

export default MinusIcon;
