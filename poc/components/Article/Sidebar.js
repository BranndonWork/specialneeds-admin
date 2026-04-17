import AdUnit from "./AdUnit";
import NewsletterSignup from "./NewsletterSignup";
import SidebarPopularArticles from "./SidebarPopularArticles";
import SidebarPopularCategories from "./SidebarPopularCategories";
import SidebarPopularTags from "./SidebarPopularTags";
import SidebarSearch from "./SidebarSearch";

const Sidebar = ({ article, sidebarData }) => {
  return (
    <aside className="widget-area">
      <AdUnit slot="sidebar_article" />
      <NewsletterSignup />
      <SidebarSearch article={article} />
      <SidebarPopularArticles articles={sidebarData?.popularArticles || []} />
      <SidebarPopularCategories categories={sidebarData?.popularCategories || []} />
      <SidebarPopularTags tags={sidebarData?.popularTags || []} />
    </aside>
  );
};

export default Sidebar;
