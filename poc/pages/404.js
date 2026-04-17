import Client404 from "@components/ErrorPages/404Client";

const ErrorPage = (props) => {
  return <Client404 {...props} />;
};

export default ErrorPage;

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    props: {
      messages
    },
    revalidate: 3600 // 1 hour - server-side cache shared by all users for DDoS protection
  };
}
