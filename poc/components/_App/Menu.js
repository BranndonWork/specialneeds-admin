import Link from "@utils/ActiveLink";

const Menu = ({ items, menuClass }) => {
  if (!menuClass) menuClass = "navbar-nav";
  return (
    <ul className={menuClass}>
      {items.map((item, index) => {
        if (item.dropdown) {
          return (
            <li className="nav-item" key={index}>
              <a href="#" className="dropdown-toggle nav-link">
                {item.anchorText}
              </a>
              <ul className="dropdown-menu">
                {item.subItems.map((subItem, subIndex) => (
                  <li className="nav-item" key={subIndex}>
                    <Link href={subItem.href} activeClassName="active" className="nav-link" onClick={item.onClick}>
                      {subItem.anchorText}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        } else {
          return (
            <li className="nav-item" key={index}>
              {/* <Link href={item.href || "#"} activeClassName="active" passHref> */}
              <a
                className="nav-link"
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                    return;
                  } else if (item.href === "#") {
                    e.preventDefault();
                  }
                }}
              >
                {item.anchorText}
              </a>
              {/* </Link> */}
            </li>
          );
        }
      })}
    </ul>
  );
};


export default Menu;
