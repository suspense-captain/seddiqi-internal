const PlusColored = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" rx="22" fill="#452C1E" />
    <path
      d="M22.0002 26.8V22M22.0002 22H26.8002M22.0002 22V17.2M22.0002 22H17.2002"
      stroke="white"
    />
  </svg>
);

export default PlusColored;
