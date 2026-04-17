import {useTranslations} from 'next-intl';
import Footer from "@components/_App/Footer";
import Navbar from "@components/_App/Navbar";
import Utils from "@utils";

const GeneralErrorPage = ({
  errorCode,
  errorHeading,
  errorMessage,
  errorData,
}) => {
  const t = useTranslations('errorPage');
  const generateErrorData = (data) => {
    if (typeof data !== "object") {
      data = { message: data };
    }

    if (!data?.message) {
      data = { message: data };
    }

    data.location = window.location;
    data.timestamp = new Date().toISOString();
    return data;
  };

  const generateContactLink = (encodedError) => {
    const message = `Hey there, SpecialNeeds Team! I stumbled upon a sneaky little error while I was using your website. I thought you'd like to know. \n\nHere's the error code that might help you catch it:\n${encodedError}`;
    return `/contact/?message=${encodeURIComponent(message)}`;
  };

  const handleCopyClick = () => {
    const textarea = document.querySelector("#errorLoadingContentTextarea");
    textarea.select();
    document.execCommand("copy");
    const copyAlert = document.querySelector("#copyAlert");
    copyAlert.classList.add("show");
    setTimeout(() => copyAlert.classList.remove("show"), 10000);
  };

  const generateErrorContentUI = () => {
    if (!errorData) return null;

    const errorDetails = generateErrorData(errorData);
    const encodedError = btoa(JSON.stringify(errorDetails, null, 2));

    return (
      <>
        <br />
        <p>{t('errorMessagePrefix')}</p>
        <a
          id="errorContactLink"
          href={generateContactLink(encodedError)}
          className="btn btn-primary"
          target="_blank" rel="noreferrer"
        >
          Send Error via Contact Form 💌
        </a>{" "}
        or{" "}
        <button
          id="errorCopyButton"
          className="btn btn-secondary"
          style={{ margin: "0 10px 0 0" }}
          onClick={handleCopyClick}
        >
          {t('copyErrorInformation')}
        </button>
        <div
          id="copyAlert"
          className="alert alert-success mt-3"
          role="alert"
          style={{ display: "none" }}
        >
          {t('successfulCopy')}
        </div>
        <textarea
          style={{ position: "absolute", left: "-9999px" }}
          id="errorLoadingContentTextarea"
          readOnly
          value={encodedError}
        />
      </>
    );
  };

  if (!errorMessage) errorMessage = t('defaultErrorMessage');

  if (!errorCode) errorCode = t('unknownError') + ": ";
  return (
    <>
      <Navbar />

      <section className="error-area bg-f9f9f9 ptb-100" style={{ marginTop: "70px" }}>
        <div className="container">
          <div className="error-content">
            <h3>
              {errorCode}
              {errorHeading}
            </h3>
            <div className="error-message" dangerouslySetInnerHTML={{ __html: errorMessage }} />
            {errorData && generateErrorContentUI()}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GeneralErrorPage;
