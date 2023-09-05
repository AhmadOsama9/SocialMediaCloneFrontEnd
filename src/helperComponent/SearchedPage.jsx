import { useState, useEffect } from "react";
import { usePage } from '../hooks/usePage'
import PageProfile from "../pages/PageProfile";
import Loader from "../helperComponent/Loader";

import "../CSS/searchedPage.css";

const SearchedPage = ({ name }) => {
  const { searchPage, pageError, pageLoading, page} = usePage();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const search = async () => {
      await searchPage(name);
    }

    search();
  }, []);

  if (pageLoading) {
    return <Loader />;
  }

  if (pageError) {
    return <h3 className=".error">Error: {pageError}</h3>
  }

  return (
    <div className="searched-page">
    {!showPage && (
      <div className="page-preview">
        <h3 className="page-title">Searched Page</h3>
        <span className="page-name">Name: {page && page.name}</span>
        <span className="page-description">Description: {page && page.description}</span>
        <button onClick={() => setShowPage(prv => !prv)} className="show-page-button">Show Page</button>
      </div>
    )}
    {showPage && <PageProfile page={page} />}
  </div>

  )
}

export default SearchedPage