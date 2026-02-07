const HamburgerIcon = ({
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
    <rect
      x="2.25"
      y="3.25"
      width="15.5"
      height="0.5"
      stroke="#464F4A"
      strokeWidth="0.5"
    />
    <rect
      x="2.25"
      y="10.25"
      width="15.5"
      height="0.5"
      stroke="#464F4A"
      strokeWidth="0.5"
    />
    <rect
      x="2.25"
      y="17.25"
      width="9.5"
      height="0.5"
      stroke="#464F4A"
      strokeWidth="0.5"
    />
  </svg>
);

export default HamburgerIcon;
