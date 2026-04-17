// ./hoc/withAuthGuard.js
// Wrapper for auth pages - returns 404 if auth is disabled

import config from "@config/config";
import ErrorPage from "../pages/404";

/**
 * HOC to guard auth-related pages
 * Returns 404 page if user auth is not enabled
 *
 * Usage:
 * export default withAuthGuard(LoginPage);
 */
const withAuthGuard = (Component) => {
  const GuardedComponent = (props) => {
    if (!config.userAuthEnabled) {
      return <ErrorPage {...props} />;
    }
    return <Component {...props} />;
  };

  // Copy static methods (like getInitialProps, getServerSideProps, etc.)
  if (Component.getInitialProps) {
    GuardedComponent.getInitialProps = Component.getInitialProps;
  }
  if (Component.getServerSideProps) {
    GuardedComponent.getServerSideProps = Component.getServerSideProps;
  }
  if (Component.getStaticProps) {
    GuardedComponent.getStaticProps = Component.getStaticProps;
  }

  return GuardedComponent;
};

export default withAuthGuard;
