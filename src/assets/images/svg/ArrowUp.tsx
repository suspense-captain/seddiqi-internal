const ArrowUp = ({
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
    fill={fill !== "" ? fill : "none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <mask id="path-1-inside-1_7024_14578" fill={"white"}>
      <path d="M12 6L6 7.15493e-08L0 6" />
    </mask>
    <path
      d="M6 7.15493e-08L6.70711 -0.707107L5.29289 -0.707107L6 7.15493e-08ZM12.7071 5.29289L6.70711 -0.707107L5.29289 0.707107L11.2929 6.70711L12.7071 5.29289ZM5.29289 -0.707107L-0.707107 5.29289L0.707107 6.70711L6.70711 0.707107L5.29289 -0.707107Z"
      fill={fill !== "" ? fill : "none"}
      mask="url(#path-1-inside-1_7024_14578)"
    />
  </svg>
);

export default ArrowUp;
