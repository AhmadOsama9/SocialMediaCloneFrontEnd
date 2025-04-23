import { useState } from 'react'
import { usePost } from '../hooks/usePost';
import Loader from "../helperComponent/Loader";

import "../CSS/createPost.css";

const CreatePost = () => {
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");

  const { createPost, postLoading, postError } = usePost();
  
  if (postLoading) {
    return <Loader />;
  }

  if (postError) {
    return <h3 className=".error">{postError}</h3>;
  }

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      <div className="input-container">
        <label className="label">Header</label>
        <input
          type="text"
          placeholder="Enter the header of the post"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          className="input"
        />
      </div>
      <div className="input-container">
        <label className="label">Content</label>
        <textarea
          type="text"
          placeholder="Enter the content of the post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea"
        />
      </div>
      <button onClick={() => createPost(header, content)} className="create-button">
        Create Post
      </button>
    </div>

  )
}

export default CreatePost