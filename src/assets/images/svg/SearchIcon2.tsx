const SearchIcon = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M21 22.7365L15.5298 15.409C18.9931 12.8084 19.6984 7.88354 17.1054 4.40992C14.5125 0.9363 9.60221 0.228901 6.13888 2.83035C2.67554 5.43101 1.97024 10.3551 4.56399 13.8287C6.31816 16.1782 9.13148 17.2619 11.8405 16.9126" stroke="#464F4A" stroke-miterlimit="10"/>
  </svg>
);

export default SearchIcon;
