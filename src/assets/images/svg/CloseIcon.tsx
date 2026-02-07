const CloseIcon = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <line
      y1="-0.5"
      x2="23"
      y2="-0.5"
      transform="matrix(-0.707107 0.707107 -0.663905 -0.747817 18 2.5)"
      stroke="#464F4A"
    />
    <line
      y1="-0.5"
      x2="23"
      y2="-0.5"
      transform="matrix(0.707107 0.707107 0.664129 -0.747618 2 2.5)"
      stroke="#464F4A"
    />
  </svg>
);

export default CloseIcon;
