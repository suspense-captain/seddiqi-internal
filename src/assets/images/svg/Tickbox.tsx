const Tickbox = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 6.5V1H1V21H21V11" stroke="black" />
  </svg>
);

export default Tickbox;
