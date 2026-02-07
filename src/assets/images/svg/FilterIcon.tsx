const FilterIcon = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 6H22" stroke="#686F5D" />
    <path d="M5 12L18 12" stroke="#686F5D" />
    <path d="M8 18L16 18" stroke="#686F5D" />
  </svg>
);

export default FilterIcon;
