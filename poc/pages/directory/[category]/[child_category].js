export async function getServerSideProps({ params }) {
  const { category, child_category } = params;
  return {
    redirect: {
      destination: `/directory/?category=${category}&sub_category=${child_category}`,
      permanent: true,
    },
  };
}

export default function ChildCategoryRedirect() {
  return null;
}
