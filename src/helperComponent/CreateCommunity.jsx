import {useState } from 'react'
import { useCommunity } from '../hooks/useCommunity'
import Loader from "../helperComponent/Loader";


import "../CSS/createCommunity.css";

const CreateCommunity = () => {
  const { isLoading, error, createCommunity } = useCommunity();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3 className=".error">Error: {error}</h3>
  }

  return (
    <div className="create-community">
        <div>
            <label className="label">Name </label>
            <input 
            type="text"
            placeholder="Enter the name of the community"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            />
        </div>
        <div>
            <label className="label">Description </label>
            <input
            type="text"
            placeholder="Enter the description of the community"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            />
        </div>
        <button onClick={() => createCommunity(name, description)} className="bttn">Create Community</button>
    </div>
  )
}

export default CreateCommunity