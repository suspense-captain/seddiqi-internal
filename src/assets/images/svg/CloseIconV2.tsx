const CloseIconV2 = ({
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
    className={className}
    
  >
    <path
      d="M2.45333 15.968C2.15669 17.2642 2 18.6138 2 20C2 29.9411 10.0589 38 20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2C14.1214 2 8.90107 4.81803 5.61608 9.17688"
      stroke={fill ? fill : "#464F4A"}
    />
    <path
      d="M17.1526 17.1905L19.9811 20.0189M22.8095 22.8474L19.9811 20.0189M22.8284 17.1716L19.9811 20.0189M19.9811 20.0189L17.1716 22.8284"
      stroke={fill ? fill : "#464F4A"}
      stroke-miterlimit="10"
    />
  </svg>
);

export default CloseIconV2;
