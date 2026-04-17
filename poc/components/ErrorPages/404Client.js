import { useTranslations } from 'next-intl';
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import Image from "next/image";

const Client404 = () => {
  const t = useTranslations('common');

  return (
    <>
      <HTMLHeaderMetaData title={t('errors.error') + ": 404"} />
      <Navbar />
      <section className="error-area bg-f9f9f9 ptb-100" style={{ marginTop: "70px" }}>
        <div className="container">
          <div className="error-content">
            <Image
              src={serveAsset("errorImage", 500, 198)}
              alt="image"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "400px" }}
              width={500}
              height={198}
            />
            <h3>Error 404 : Page Not Found</h3>
            <p>
              The page you are looking for might have been removed had its name changed or is
              temporarily unavailable.
            </p>
            <Link href="/" className="default-btn">
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Client404;
