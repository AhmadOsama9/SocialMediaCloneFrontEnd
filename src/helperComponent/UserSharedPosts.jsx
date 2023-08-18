import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";


const UserSharedPosts = () => {
    const { sharedPosts } = useUserPostsContext();
    const { getSharedPosts, postLoading, postError, deletePost, updatePost, getPostReactions, getPostComments, getPostSharesCount } = usePost();

    const [showReactions, setShowReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [showUpdate, setShowUpdate] = useState({});

    const [reactions, setReactions] = useState({});
    const [comments, setComments] = useState({});
    const [shares, setShares] = useState({});

    const [editedHeaders, setEditedHeaders] = useState({});
    const [editedContents, setEditedContents] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            await getSharedPosts();

            for (const post of sharedPosts) {
                const reactions = await getPostReactions(post.postId);
                setReactions(reactions);

                const comments = await getPostComments(post.postId);
                setComments(comments);

                const shares = await getPostSharesCount(post.postId);
                setShares(shares);
            }

        }
        fetchPosts();
    }, []);

    const handleUpdate = (post) => {
        setShowUpdate(prvState => ({...prvState, [post.postId]: true}));
        setEditedHeaders(prvState => ({...prvState, [post.postId]: post.header}));
        setEditedContents(prvState => ({...prvState, [post.postId]: post.content}));

    }

    const handleShowReactions = (post) => {
        setShowReactions(prvState => ({...prvState, [post.postId]: !prvState[post.postId]}));
    }

    const handleShowComments = (post) => {
        setShowComments(prvState => ({...prvState, [post.postId]: !prvState[post.postId]}));
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

    if (sharedPosts.length === 0) {
        return <h3>You have no Posts</h3>;
    }
    return (
        <div>
            {sharedPosts.map((post) => (
                <div>
                    <button onClick={() => handleUpdate(post)}>Update</button>
                    <button onClick={() => deletePost(post.postId)}>Delete</button>
                    {!showUpdate[post.postId] && (
                    <div>
                        <h3>Creator: {post.nickname}</h3>
                        <h4>Header: {post.header}</h4>
                        <p>Content: {post.content}</p>
                        <button onClick={() => handleShowReactions(post)}>Reactions</button>
                        <span> {reactions.length > 0 ?  reactions.length : 0}</span>
                        <button onClick={() => handleShowComments(post)}>Comments</button>
                        <span> {comments.length > 0 ?  comments.length : 0}</span>
                        <span> Shares {shares.length > 0 ? shares.length : 0}</span>

                        {showReactions[post.postId] && (
                            <div>
                                {reactions > 0 ? (
                                    post.reactions.map((reaction) => (
                                        <div>
                                            <h5>owner: {reaction.nickname}</h5>
                                            <h5>Reaction: {reaction.reaction}</h5>
                                        </div>
                                    ))
                                ) : (
                                    <p>No Reactions</p>
                                )}
                            </div>
                        )}
                        {showComments[post.postId] && (
                            <div>
                                {comments > 0 ? (
                                    post.comments.map((comment) => (
                                        <div>
                                            <h5>onwner: {comment.nickname}</h5>
                                            <h5>content: {comment.content}</h5>
                                            <h5>CreatedAt: {comment.createdAt}</h5>
                                        </div>
                                    ))
                                ) : (
                                    <p>No Comments</p>
                                )}
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


export default UserSharedPosts;