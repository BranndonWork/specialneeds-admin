import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Connecting Families to Special Needs Resources and Information!"
          />
          <meta
            name="keywords"
            content="Special Needs, Autism, ADHD, Down Syndrome, Learning Disabilities, Mental Health, Child Development, Child Care, Child Care Providers, Child Care Centers, Child Care Resources, Child Care Information, Child Care Referrals, Child Care Referral Services, Child Care"
          />
          <meta charSet="UTF-8" />

          {/* PWA Meta Tags */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#007bff" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="SpecialNeeds" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

          {/* Favicon */}
          <link
            rel="icon"
            type="image/png"
            href="https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg/favicon/public"
          />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />

          {/* Analytics & Service Worker */}
          {process.env.NODE_ENV === "production" && (
            <script
              defer
              data-domain="specialneeds.com"
              data-api="/t/api/event"
              src="/t/js/script.js"
            ></script>
          )}
          <script defer src="/js/registerServiceWorkers.js"></script>
        </Head>
        <body>
          <Main role="main" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
