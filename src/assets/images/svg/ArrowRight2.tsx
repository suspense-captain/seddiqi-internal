const ArrowRight = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="33" 
    height="32" 
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <mask id="path-1-inside-1_22218_3347" fill="white">
    <path d="M11.7 25.5999L21.3 15.9999L11.7 6.3999"/>
    </mask>
    <path d="M21.3 15.9999L22.0071 16.707V15.2928L21.3 15.9999ZM12.4071 26.307L22.0071 16.707L20.5929 15.2928L10.9929 24.8928L12.4071 26.307ZM22.0071 15.2928L12.4071 5.6928L10.9929 7.10701L20.5929 16.707L22.0071 15.2928Z" fill="#282828" mask="url(#path-1-inside-1_22218_3347)"/>
  </svg>
);

export default ArrowRight;
