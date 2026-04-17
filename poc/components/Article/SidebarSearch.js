import { useRouter } from "next/router";
const SidebarSearch = () => {
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/articles/?q=${e.target[0].value}`);
  };

  return (
    <section className="widget widget_search">
      <h3 className="widget-title">Search</h3>

      <form className="search-form" onSubmit={handleSearch}>
        <label>
          <span className="screen-reader-text">Search for:</span>
          <input type="search" className="search-field" placeholder="Search..." />
        </label>
        <button type="submit">
          <i className="bx bx-search-alt"></i>
        </button>
      </form>
    </section>
  );
};


export default SidebarSearch;
