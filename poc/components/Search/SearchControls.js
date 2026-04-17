import { useRouter } from "next/router";

const SearchControls = ({ defaultPerPage }) => {
  const router = useRouter();
  const perPage = router.query.perPage || defaultPerPage;

  const handlePerPageChange = (e) => {
    const queryParams = { ...router.query, perPage: e.target.value };
    const updatedQuery = { ...router.query, ...queryParams };
    if (isNaN(updatedQuery.perPage) || String(updatedQuery.perPage) === String(defaultPerPage)) {
      delete updatedQuery.perPage;
    }
    delete updatedQuery.pageNumber;
    router.replace({ pathname: router.pathname, query: updatedQuery }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="d-flex align-items-center">
      <label className="me-2" htmlFor="perPageSelect">
        Per Page:
      </label>
      <select
        className="form-select"
        style={{ width: "auto" }}
        id="perPageSelect"
        onChange={handlePerPageChange}
        value={perPage}
      >
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
      </select>
    </div>
  );
};

export default SearchControls;
