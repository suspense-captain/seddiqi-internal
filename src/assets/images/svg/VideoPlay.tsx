const VideoPlay = ({ fill }: { fill?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_27_106)">
        <rect
          x="5.5"
          y="5.5"
          width="55"
          height="55"
          rx="27.5"
          stroke="white"
          // shape-rendering="crispEdges"
          strokeWidth="2"
        />
        <path
          d="M29 27L41 33L29 39V27Z"
          stroke="white"
          stroke-linejoin="round"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_27_106"
          x="0"
          y="0"
          width="66"
          height="66"
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
            result="effect1_dropShadow_27_106"
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
            result="effect1_dropShadow_27_106"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_27_106"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default VideoPlay;
