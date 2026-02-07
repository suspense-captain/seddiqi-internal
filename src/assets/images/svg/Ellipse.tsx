const Ellipse = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.792 1.20148C10.2159 1.06964 9.61608 1 9 1C4.58172 0.999999 1 4.58172 0.999999 9C0.999999 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 6.38731 15.7475 4.06714 13.8103 2.60714"
      stroke="#271610"
    />
  </svg>
);

export default Ellipse;
