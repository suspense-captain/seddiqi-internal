const AccountIcon = ({ fill, className }: { fill?: string; className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path
      d="M3.67969 23.952C3.23473 25.8963 2.99969 27.9207 2.99969 30C2.99969 44.9117 15.088 57 29.9997 57C44.9114 57 56.9997 44.9117 56.9997 30C56.9997 15.0883 44.9114 3 29.9997 3C21.1819 3 13.3513 7.22704 8.42381 13.7653"
      stroke="#464F4A"
    />
    <path
      d="M24.7681 24.7322L30.0714 30.0355M35.3747 35.3388L30.0714 30.0355M35.4102 24.6967L30.0714 30.0355M30.0714 30.0355L24.8036 35.3033"
      stroke="#464F4A"
      stroke-miterlimit="10"
    />
  </svg>
);

export default AccountIcon;
