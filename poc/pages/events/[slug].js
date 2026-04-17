import PageBanner from "@components/Common/PageBanner";
import Footer from "@components/_App/Footer";
import HTMLHeaderMetaData from "@components/_App/HTMLHeaderMetaData";
import Navbar from "@components/_App/Navbar";
import constants from "@data/texts/en/constants.json";
import events from "@data/texts/en/events.json";
import SpecialNeedsAPI from "@utils/server/api/SpecialNeedsAPI";
import ErrorPage from "../404";
import DisplayEvent from "./DisplayEvent";

const EventSlugPage = ({ event, pageMeta, error404 }) => {
  if (error404) {
    return <ErrorPage />;
  }

  if (!event?.id) {
    return null;
  }

  return (
    <>
      <HTMLHeaderMetaData {...pageMeta} />
      <Navbar />
      <PageBanner
        bannerFilename=""
        pageTitle={constants.specialNeeds + " " + events.pageTitle}
        pageName={constants.events}
      />
      <DisplayEvent event={event} />
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

export async function getStaticProps(context) {
  const { slug } = context.params;
  const api = new SpecialNeedsAPI(context);

  try {
    const data = await api.get(`/events/${slug}/`);
    const event = data?.event || data;

    if (!event?.id) {
      return { notFound: true };
    }

    let title = event.title || '';
    if (event.category?.name) title += ` | ${event.category.name}`;
    if (event.address?.city) title += ` | ${event.address.city}`;
    if (event.address?.state_province) title += `, ${event.address.state_province}`;

    return {
      props: {
        event,
        pageMeta: {
          title,
          keywords: event.tags || [],
          description: event.content_text || '',
        },
        error404: false,
      },
      revalidate: 3600,
    };
  } catch (error) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export default EventSlugPage;
