import {useTranslations} from 'next-intl';
import { footer as links } from "@data/links";
import Link from "next/link";
import Image from "next/image";
import Copyright from "../Common/Copyright";
import { serveAsset } from "@utils/assetHelpers";

export const FooterLinks = () => {
  const t = useTranslations('footer');
  return (
    <>
      {['section1', 'section2', 'section3'].map((section, index) => {
          return (
            <div className="col-lg-3 col-sm-6 col-md-6" key={index}>
              <div className="single-footer-widget">
                <h3>{t(`${section}.heading`)}</h3>
                <ul className="link-list">
                  {links[section].map((link, i) => (
                    <li key={i}>
                      <Link href={link.href}>{link.anchorText}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
    </>
  );
};

const Footer = ({ bgColor }) => {
  return (
    <>
      <footer className={`footer-area ${bgColor}`}>
        <div className="container">
          <div className="row">
            <FooterLinks />
            {/* <LanguageSwitch /> */}
          </div>
          <Copyright />
        </div>
        <div className="footer-image text-center">
          <Image src={serveAsset("footerImage", 1500)} alt="image" width={1500} height={300} />
        </div>
      </footer>
    </>
  );
};


export default Footer;
