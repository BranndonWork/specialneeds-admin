import {useTranslations} from 'next-intl';
import Link from "next/link";

const getCategorySearchQuery = (categorySlug) => {
  // categorySlug is in format "recreational-activities/camps" or "counseling"
  const parts = categorySlug.split("/");
  let query = `/directory/?category=${parts[0]}`;
  if (parts.length > 1) {
    query += `&sub_category=${parts[1]}`;
  }
  return query;
};

const getCategoryName = (categorySlug) => {
  // Convert "recreational-activities/camps" to "Recreational Activities > Camps"
  const parts = categorySlug.split("/");
  const displayParts = parts.map(part => {
    return part.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  });
  return displayParts.join(" > ");
};

const displayCategories = (categoriesObject, listingsText) => {
  const min_count = 1;
  const max_count = 12;

  // Convert the object into an array of { slug, count }
  const categoriesArray = Object.keys(categoriesObject).map((slug) => ({
    slug: slug,
    count: categoriesObject[slug],
  }));

  if (categoriesArray.length > 0) {
    categoriesArray.sort((a, b) => b.count - a.count);

    let rendered = 0;
    return (
      <div className="category-row">
        {categoriesArray.map((category, idx) => {
          if (category.count < min_count || rendered === max_count) {
            return null;
          }
          rendered++;
          return (
            <Link href={getCategorySearchQuery(category.slug)} key={idx} className="category-item">
              <h3>{getCategoryName(category.slug)}</h3>
              <span>
                {category.count} {listingsText}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }
};

const Category = ({ categories }) => {
  const tCommon = useTranslations('common');
  const tDescriptions = useTranslations('descriptions');

  return (
    <>
      <section id="homepage-directory-categories" className="category-area pt-100">
        <div className="container">
          <div className="section-title">
            <h2>{tCommon('terms.popular')} {tCommon('labels.categories')}</h2>
            <p>{tDescriptions('popularCategories')}</p>
          </div>
          {displayCategories(categories, tCommon('terms.listings'))}
        </div>
      </section>
    </>
  );
};

export default Category;
