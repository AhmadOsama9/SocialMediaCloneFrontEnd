import { useState, useEffect } from "react";
import { usePage } from '../hooks/usePage'
import PageProfile from "../pages/PageProfile";

const SearchedPage = ({ name }) => {
  const { searchPage, pageError, pageLoading, page} = usePage();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    searchPage(name);
  }, []);
  

  if (pageLoading) {
    return <h3>Loading...</h3>
  }

  if (pageError) {
    return <h3>Error: {pageError}</h3>
  }

  return (
    <div>
      <h3>Searched Page</h3>
      <span>name: {page.name}</span>
      <span>description: {page.description}</span>
      <button onClick={() => setShowPage(prv => !prv)}>Show Page</button>

      {showPage && <PageProfile  page={page}/>}
    </div>
  )
}

export default SearchedPage