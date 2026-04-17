import Form from "./Form";

const SearchHeader = ({ formTitle, formSubTitle, displayForm = false }) => {
  const minimalHeaderPadding = !displayForm ? { padding: "50px 0" } : {};
  return (
    <div className={`page-title-bg ${minimalHeaderPadding ? "no-form" : ""}`}>
      <div className="container directory-page">
        <Form title={formTitle} formSubTitle={formSubTitle} displayForm={displayForm} />
      </div>
    </div>
  );
};


export default SearchHeader;
