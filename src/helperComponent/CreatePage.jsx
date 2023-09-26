import { useState } from "react";
import { usePage } from "../hooks/usePage";
import PageProfile from "../pages/PageProfile";
import Loader from "../helperComponent/Loader";

import "../CSS/createPage.css";

const CreatePage = () => {
  const { createPage, pageError, pageLoading } = usePage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [page, setPage] = useState(null);
  const [showPage, setShowPage] = useState(false);

  const handleCreatePage = async () => {
    const page = await createPage(name, description);
    setPage(page);
    setShowPage(true);
  }

  if (pageLoading) {
    return <Loader />;
  }

  if (pageError) {
    return <h3 className="error">Error: {pageError}</h3>
  }

  if (showPage) {
    return <PageProfile page={page} />
  }

  return (
    <div className="create-page">
      <div className="input-container">
        <label className="label">Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter the name of the page"
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>
      <div className="input-container">
        <label className="label">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </div>
      <button onClick={handleCreatePage} className="create-button">
        Create Page
      </button>
  </div>

  )
}

export default CreatePage