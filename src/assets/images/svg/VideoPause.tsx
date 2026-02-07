const VideoPause = ({ fill }: { fill?: string }) => {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_150_2647)">
        <rect
          x="5"
          y="5"
          width="36"
          height="36"
          rx="18"
          fill="white"
          fill-opacity="0.2"
          shape-rendering="crispEdges"
        />
        <path d="M20.4287 19.1431V26.8574" stroke="white" />
        <path d="M25.3379 19.1426V26.8569" stroke="white" />
      </g>
      <defs>
        <filter
          id="filter0_d_150_2647"
          x="0"
          y="0"
          width="46"
          height="46"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_150_2647"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_150_2647"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_150_2647"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default VideoPause;
