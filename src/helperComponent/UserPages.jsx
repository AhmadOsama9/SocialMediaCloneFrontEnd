import { useState, useEffect } from "react";
import { useUserPages } from "../hooks/useUserPages";
import PageProfile from "../pages/PageProfile";
import Loader from "./Loader";

import "../CSS/userPages.css";

const UserPages = () => {
  const {isLoading, error, userPages, getUserPages} = useUserPages();
  const [showPageProfile, setShowPageProfile] = useState(false);
  const [page, setPage] = useState(null);

  const handleShowPage = (page) => {
    setPage(page);
    setShowPageProfile(prv => !prv);
  }
  
  useEffect(() => {
    getUserPages();
    setShowPageProfile(false);
  }, []);

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }

  if (userPages.length === 0) {
    return <h3>You didn't create any pages </h3>;
  }

  return (
    <div className="user-pages">
        <h2 className="section-title">Your Pages</h2>
        {!showPageProfile && userPages.map((page) => (
            <div className="page-info" key={page._id}>
                <span className="page-name">Name: {page.name}</span>
                <span className="page-description">Description: {page.description}</span>
                <button onClick={() =>handleShowPage(page)} className="toggle-button">
                    {showPageProfile ? "Go back" : "Show Page"}
                </button>
            </div>
        ))}
        {showPageProfile && <button className="toggle-button" onClick={() => setShowPageProfile(prv => !prv)}>Go back</button>}
      {showPageProfile && <PageProfile page={page} />}
    </div>

  )
}

export default UserPages