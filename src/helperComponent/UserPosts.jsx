import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";


const UserPosts = () => {
    const { userPosts } = useUserPostsContext();
    const { getCreatedPosts, postLoading, postError, deletePost, updatePost } = usePost();

    const [showReactions, setShowReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [showUpdate, setShowUpdate] = useState({});

    const [editedHeaders, setEditedHeaders] = useState({});
    const [editedContents, setEditedContents] = useState({});

    useEffect(() => {
        getCreatedPosts();
    }, [])

    const handleUpdate = (post) => {
        setShowUpdate(prvState => ({...prvState, [post.postId]: true}));
        setEditedHeaders(prvState => ({...prvState, [post.postId]: post.header}));
        setEditedContents(prvState => ({...prvState, [post.postId]: post.content}));

    }

    const handleShowReactions = (post) => {
        setShowReactions(prvState => ({...prvState, [post.postId]: true}));
    }

    const handleShowComments = (post) => {
        setShowComments(prvState => ({...prvState, [post.postId]: true}));
    }

    const handleCallUpdate = async (post) => {
        if (editedHeaders[post.postId] !== post.header || editedContents[post.postId] !== post.content) {
            await updatePost(post.postId, editedHeaders[post.postId], editedContents[post.postId]);
        } else {
            alert("There's nothing to be udpated");
        }
        setShowUpdate(prvState => ({...prvState, [post.postId]: false}));
    }



    if (postLoading) {
        return <h3>Loading...</h3>;
    }

    if (postError) {
        return <h3>Error: {postError}</h3>;
    }

    if (userPosts.length === 0) {
        return <h3>You have no Posts</h3>;
    }
    return (
        <div>
            {userPosts.map((post) => (
                <div>
                    <button onClick={() => handleUpdate(post)}>Update</button>
                    <button onClick={() => deletePost(post.postId)}>Delete</button>
                    {!showUpdate[post.postId] && (
                    <div>
                        <h3>Creator: {post.nickname}</h3>
                        <h4>Header: {post.header}</h4>
                        <p>Content: {post.content}</p>
                        <button onClick={() => handleShowReactions(post)}>Reactions</button>
                        <button onClick={() => handleShowComments(post)}>Comments</button>
                        {showReactions[post.postId] && (
                            <div>
                            {post.reactions.map((reaction) => (
                                <div>
                                    <h5>owner: {reaction.nickname}</h5>
                                    <h5>Reaction: {reaction.reaction}</h5>
                                </div>
                            ))}
                            </div>
                        )}
                        {showComments[post.postId] && (
                            <div>
                            {post.comments.map((comment) => (
                                <div>
                                    <h5>onwner: {comment.nickname}</h5>
                                    <h5>content: {comment.content}</h5>
                                    <h5>CreatedAt: {comment.createdAt}</h5>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                    )}
                    {showUpdate[post.postId] && (
                        <div>
                            <input 
                              type="text"
                              value={editedHeaders[post.postId]}
                              onChange={(e) => setEditedHeaders(prvState => ({ ...prvState, [post.postId]: e.target.value}))}
                            />
                            <textarea
                              value={editedContents[post.postId]}
                              onChange={(e) => setEditedContents(prvState => ({ ...prvState, [post.postId]: e.target.value}))}
                            />
                            <button onClick={() => handleCallUpdate(post)}>Save</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

}


export default UserPosts;