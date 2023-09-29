import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { useCreatePagePostContext } from "../context/CreatePagePostContext";
import Loader from "../helperComponent/Loader";

import "../CSS/createPagePost.css";

const CreatePagePost = ({ pageName }) => {
    const [header, setHeader] = useState("");
    const [content, setContent] = useState("");
    const { setCreatePost } = useCreatePagePostContext();

    const { createPagePost, postLoading, postError } = usePost(); 

    if (postLoading) {
        return <Loader />;
    }

    if (postError) {
        return <h3 className=".error">Error: {postError}</h3>
    }

    const handleAddPost = () => {
        if (header === "" || content === "") {
            alert("The two fields must be filled");
            return;
        }
        createPagePost(pageName, header, content);
        setCreatePost(false);
    }

    return (
        <div className="create-page-post-container">
            <h2 className="create-post-title">Create Post</h2>
            <div className="create-post-input">
                <label className="create-post-label">Header</label>
                <input
                type="text"
                placeholder="Enter the header of the post"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="create-post-input-field"
                />
            </div>
            <div className="create-post-input">
                <label className="create-post-label">Content</label>
                <textarea
                type="text"
                placeholder="Enter the content of the post"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="create-post-textarea"
                />
            </div>
            <button onClick={handleAddPost} className="create-post-button">
                Create Post
            </button>
        </div>

    )
}

export default CreatePagePost;