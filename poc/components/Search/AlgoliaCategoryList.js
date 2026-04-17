import { caseInsensitiveCompare } from "@utils/textHelpers";
import { useEffect, useState } from "react";
import ClearFilters from "./ClearFilters";
import CustomBadge from "./CustomBadge";

const mapCategories = (categories) => {
  let mappedCategories = {};

  for (let [key, value] of Object.entries(categories)) {
    const [parent, child] = key.split(" > ");
    if (!mappedCategories[parent]) mappedCategories[parent] = { total: 0, children: {} };
    mappedCategories[parent].total += value;
    if (child) mappedCategories[parent].children[child] = value;
  }

  return mappedCategories;
};

const CategoryCountBadge = ({ count, handleClick }) => {
  let formattedCount = count;

  if (formattedCount > 999) {
    formattedCount = Math.floor(formattedCount / 100);
    formattedCount = `${formattedCount / 10}k`;
    formattedCount = formattedCount.replace(".0", "");
  } else {
    formattedCount = formattedCount.toLocaleString();
  }

  return <CustomBadge content={formattedCount} onClick={handleClick} title={count} />;
};

const AlgoliaCategoryList = ({
  categories,
  handleParentClick,
  expandedParents,
  onChildClick,
  activeChild,
  clearChild,
  clearParent,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [mappedCategories, setMappedCategories] = useState({});

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const scrollable = Object.keys(mappedCategories).length > 5;

  useEffect(() => {
    setMappedCategories(mapCategories(categories));
  }, [categories]);

  return (
    <>
      {scrollable && (
        <a href="#" onClick={toggleShowMore} className="show-more-categories">
          {showMore ? "Show Less" : "Show More"}
        </a>
      )}
      <ul id="algolia-category-list" className={scrollable && !showMore ? "scrollable" : ""}>
        {Object.entries(mappedCategories).map(([parent, details]) => {
          const isParentExpanded = !!expandedParents[parent];
          return (
            <li key={parent} style={{ cursor: "pointer" }}>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <a
                    onClick={() => handleParentClick(parent)}
                    className={isParentExpanded ? "active" : ""}
                  >
                    {parent}
                  </a>
                  {isParentExpanded && !activeChild && (
                    <ClearFilters onClick={() => clearParent(parent)} />
                  )}
                </div>
                <CategoryCountBadge
                  count={details.total}
                  handleClick={() => handleParentClick(parent)}
                />
              </div>

              {isParentExpanded && (
                <ul>
                  {Object.entries(details.children).map(([child, count]) => {
                    const isChildActive = caseInsensitiveCompare(child, activeChild);
                    return (
                      <li key={`${parent} > ${child}`} style={{ cursor: "pointer" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <a
                              onClick={() => onChildClick(child, parent)}
                              className={isChildActive ? "active" : ""}
                            >
                              {child}
                            </a>
                            {isChildActive && <ClearFilters onClick={() => clearChild(child)} />}
                          </div>
                          <CategoryCountBadge
                            count={count}
                            handleClick={() => onChildClick(child, parent)}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AlgoliaCategoryList;
