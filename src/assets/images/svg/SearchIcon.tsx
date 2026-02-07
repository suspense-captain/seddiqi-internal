const SearchIcon = ({ fill, className }: { fill?: string; className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <g clip-path="url(#clip0_18810_12193)">
      <path
        d="M17.5 19.0671L12.9415 12.9608C15.8276 10.7936 16.4153 6.68957 14.2545 3.79489C12.0937 0.900204 8.00184 0.310705 5.11573 2.47858C2.22962 4.6458 1.64187 8.74918 3.80332 11.6439C5.26514 13.6018 7.60956 14.5049 9.86711 14.2138"
        stroke={fill ? (fill === "#" ? "#2B2219" : fill) : "#2B2219"}
        stroke-miterlimit="10"
      />
    </g>
    <defs>
      <clipPath id="clip0_18810_12193">
        <rect width="20" height="20" fill="white" transform="translate(0 0.119141)" />
      </clipPath>
    </defs>
  </svg>
);

export default SearchIcon;
