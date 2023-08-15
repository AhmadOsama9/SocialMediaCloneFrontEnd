import { useState } from "react";
import { usePage } from "../hooks/usePage";

const CreatePage = () => {
  const { createPage, pageError, pageLoading } = usePage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (pageLoading) {
    return <h3>Loading...</h3>
  }

  if (pageError) {
    return <h3>Error: {pageError}</h3>
  }

  return (
    <div className="create-page">
        <div>
          <label className="label">Name</label>
          <input 
            type="text"
            value={name}
            placeholder="Enter the name of the page"
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
            />
        </div>
        <button onClick={() => createPage(name, description)}>Create Page</button>
    </div>
  )
}

export default CreatePage