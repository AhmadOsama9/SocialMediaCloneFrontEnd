import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { useCreateCommunityContext } from "../context/createCommunityContext";


const CreateCommunityPost = ({ communityId}) => {
    const [header, setHeader] = useState("");
    const [content, setContent] = useState("");
    const { setCreatePost } = useCreateCommunityContext();

    const { addPost, postLoading, postError } = usePost(); 

    if (postLoading) {
        return <h3>Loading...</h3>
    }

    if (postError) {
        return <h3>Error: {postError}</h3>
    }

    const handleAddPost = () => {
        if (header === "" || content === "") {
            alert("The two fields must be filled");
            return;
        }
        addPost(header, content, communityId);
        setCreatePost(false);
    }

    return (
        <div className="create-post">
            <h2>Create Post</h2>
            <div>
                <label className="label">Header</label>
                <input 
                  type="text"
                  placeholder="Enter the header of the post"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  className="input"
                />
            </div>
            <div>
                <label className="label">Content</label>
                <textarea
                  type="text"
                  placeholder="Enter the content of the post"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea"
                />
            </div>
            <button onClick={handleAddPost}>Create Post</button>
        </div>
    )
}

export default CreateCommunityPost;