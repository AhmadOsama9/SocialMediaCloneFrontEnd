import {useState } from 'react'
import { useCommunity } from '../hooks/useCommunity'
import CommunityProfile from '../pages/CommunityProfile';

import Loader from "../helperComponent/Loader";


import "../CSS/createCommunity.css";

const CreateCommunity = () => {
  const { isLoading, error, createCommunity } = useCommunity();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [showCommunity, setShowCommunity] = useState(false);
  const [community, setCommunity] = useState(null);

  const handleCreateCommunity = async () => {
    const community = await createCommunity(name, description)
    setCommunity(community);
    setShowCommunity(true);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }

  if (showCommunity) {
    return <CommunityProfile community={community} />
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
        <button onClick={handleCreateCommunity} className="bttn">Create Community</button>
    </div>
  )
}

export default CreateCommunity