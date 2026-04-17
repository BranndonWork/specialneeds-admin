export async function getServerSideProps({ params }) {
  const { category, slug } = params;
  return {
    redirect: {
      destination: `/articles/?category=${category}&sub_category=${slug}`,
      permanent: true,
    },
  };
}

export default function CategoryRedirect() {
  return null;
}
