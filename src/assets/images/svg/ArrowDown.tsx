const ArrowRight = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="12"
    height="6"
    viewBox="0 0 12 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transition: "all .3s" }}
  >
    <mask id="path-1-inside-1_4912_958" fill="white">
      <path d="M0 -5.24537e-07L6 6L12 0" />
    </mask>
    <path
      d="M6 6L5.29289 6.70711L6.70711 6.70711L6 6ZM-0.707107 0.707106L5.29289 6.70711L6.70711 5.29289L0.707107 -0.707107L-0.707107 0.707106ZM6.70711 6.70711L12.7071 0.707107L11.2929 -0.707107L5.29289 5.29289L6.70711 6.70711Z"
      fill={`${fill ? fill: '#271610'}`}
      mask="url(#path-1-inside-1_4912_958)"
    />
  </svg>
);

export default ArrowRight;
