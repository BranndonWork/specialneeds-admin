export async function getServerSideProps({ params }) {
  const { category } = params;
  return {
    redirect: {
      destination: `/directory/?category=${category}`,
      permanent: true,
    },
  };
}

export default function CategoryRedirect() {
  return null;
}
