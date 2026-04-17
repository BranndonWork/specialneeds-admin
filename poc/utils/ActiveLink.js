import { useRouter } from "next/router";
import Link from "next/link";

const ActiveLink = ({ children, activeClassName, className: propClassName, ...props }) => {
  const router = useRouter();
  let className = propClassName || "";
  if (router.pathname === props.href && activeClassName) {
    className = `${className} ${activeClassName}`.trim();
  }
  return (
    <Link {...props} className={className || undefined}>
      {children}
    </Link>
  );
};

export default ActiveLink;
