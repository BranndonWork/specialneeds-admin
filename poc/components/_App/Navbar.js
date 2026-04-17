import config from "@config/config";
import { serveAsset } from "@utils/assetHelpers";
import { menuItems } from "@data/links";
import Utils from "@utils";
import Link from "@utils/ActiveLink";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import Image from "next/image";
import useAd from "@hooks/useAd";
import HouseAd from "@components/Article/HouseAd";

const SiteMenu = () => {
  return (
    <>
      <ul className="navbar-nav dropdown-menu site-menu">
        <li className="nav-item">
          <Link href="/" className="nav-link">Home</Link>
        </li>

        <li className="nav-item">
          <Link href="/directory/" className="nav-link">Directory</Link>
        </li>

        {/* <li className="nav-item">
            <a href="/events/" className="nav-link">Events</a>
        </li> */}

        <li className="nav-item">
          <Link href="/articles/" className="nav-link">Articles</Link>
        </li>

        <li className="nav-item">
          <Link href="/articles/?category=news" className="nav-link">News</Link>
        </li>

        {/* kept as an example of submenus */}
        {/* <li className="nav-item ">
          <a
            href="#"
            className="dropdown-toggle nav-link no-caret"
            onClick={(e) => {
              // toggle the nested hidden menu
              e.preventDefault();

              const submenu = e.target.nextSibling;
              submenu.classList.toggle("d-none");
            }}
          >
            Pages
          </a>
          <ul className="dropdown-menu d-none">
            <li className="nav-item">
              <Link href="/faq/" activeClassName="active">
                <a className="nav-link">FAQ</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/how-it-works/" activeClassName="active">
                <a className="nav-link">How It Works</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/pricing/" activeClassName="active">
                <a className="nav-link">Pricing</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/gallery/" activeClassName="active">
                <a className="nav-link">Gallery</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/privacy-policy/" activeClassName="active">
                <a className="nav-link">Privacy Policy</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/terms-and-conditions/" activeClassName="active">
                <a className="nav-link">Terms and Conditions</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/virtual-authors/" activeClassName="active">
                <a className="nav-link">Virtual Authors</a>
              </Link>
            </li>
          </ul>
        </li> */}
      </ul>
      <style jsx>
        {`
          .miran-nav .navbar .navbar-nav .nav-item:hover .dropdown-menu.site-menu,
          .site-menu {
            width: 300px;
            border: none;
          }
          .site-menu a.nav-link {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          .site-menu li.nav-item,
          .site-menu li.nav-item:hover {
            padding-top: 0 !important;
          }
          @media (min-width: 1200px) {
            .miran-nav .navbar .navbar-nav .nav-item:hover .dropdown-menu.site-menu,
            .site-menu {
              width: 100%;
              border: none;
            }
          }
        `}
      </style>
    </>
  );
};

const Navbar = ({ styles, classes = "main-content" }) => {
  if (!styles) styles = {};
  const [showMenu, setshowMenu] = useState(false);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setshowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".mini-auth-class")) {
        if (showMenu) {
          setshowMenu(false);
        }
      }
    };

    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [showMenu]);

  return (
    <span style={styles} className={classes}>
      <div id="main-navbar" className="navbar-area" ref={navbarRef}>
        <div id="navbar-logo">
          <div className="logo">
            <Link href="/">
              <Image src={serveAsset("logoHorizontal")} alt="logo" className="logo-full" width={464} height={68} />
            </Link>
          </div>
        </div>

        <div id="left-hamburger-menu">
          <div className="miran-responsive-nav">
            <div className="miran-responsive-menu">
              <button
                type="button"
                onClick={toggleMenu}
                className="hamburger-menu hamburger-two dashboard-hamburger"
                aria-label="Toggle navigation"
                aria-expanded={showMenu}
                aria-controls="main-nav-menu"
              >
                {showMenu ? <i className="bx bx-x" aria-hidden="true"></i> : <i className="bx bx-menu" aria-hidden="true"></i>}
              </button>
            </div>
          </div>
          <div className={showMenu ? "miran-nav show" : "miran-nav"}>
            <nav className="navbar navbar-expand-md navbar-light" role="navigation" aria-label="Main navigation">
              <div id="main-nav-menu" className="collapse navbar-collapse main-menu">
                <Menu items={menuItems} />

                <div className="others-option d-flex align-items-center">
                  <div className="option-item" style={{ marginLeft: 0 }}>
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <a href="#" className="dropdown-toggle nav-link no-caret user-drop">
                          <span data-toggle="modal">
                            <i className="bx bx-menu"></i> Menu
                          </span>
                        </a>
                        <SiteMenu />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 1200px) {
            .others-option.d-flex.align-items-center {
              visibility: hidden;
            }
          }
        `}</style>
      </div>
    </span>
  );
};

export default Navbar;
