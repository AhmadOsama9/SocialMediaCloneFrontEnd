import { useState, useEffect } from "react";
import { usePage } from '../hooks/usePage'
import PageProfile from "../pages/PageProfile";
import Loader from "../helperComponent/Loader";


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
    return <h3>Error: {pageError}</h3>
  }

  return (
    <div>
      {!showPage && (
       <div>
        <h3>Searched Page</h3>
        <span>name: {page && page.name}</span>
        <span>description: {page && page.description}</span>
        <button onClick={() => setShowPage(prv => !prv)}>Show Page</button>

       </div>
      )}
      {showPage && (
        <PageProfile  page={page}/>
      )}
    </div>
  )
}

export default SearchedPage