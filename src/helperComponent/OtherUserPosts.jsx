import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";


const OtherUserPosts = (otherUserId) => {
    const [otherUserPosts, setOtherUserPosts] = useState([]);
    const { getOtherUserCreatedPosts, postLoading, postError, } = usePost();

    //don't forgot that you should initalize and modify the reaction and the comments 
    //from the database

    const [showReactions, setShowReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [addReaction, setAddReaction] = useState({});
    const [addComment, setAddComment] = useState({});
    const [reactions, setReactions] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        const result = getOtherUserCreatedPosts(otherUserId);
        setOtherUserPosts(result);
    }, [])


    const handleShowReactions = (post) => {
        setShowReactions(prvState => ({...prvState, [post.postId]: true}));
    }

    const handleShowComments = (post) => {
        setShowComments(prvState => ({...prvState, [post.postId]: true}));
    }

    const handleToggleReaction = (post) => {
        setAddReaction(prvState => ({...prvState, [post.postId]: true}));
    }

    const handleAddComment = (post) => {
        setAddComment(prvState => ({ ...prvState, [post.postId]: true}));
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
            {otherUserPosts.map((post) => (
                <div>
                    <button onClick={() => handleUpdate(post)}>Update</button>
                    <button onClick={() => deletePost(post.postId)}>Delete</button>
                    <div>
                        <h3>Creator: {post.nickname}</h3>
                        <h4>Header: {post.header}</h4>
                        <p>Content: {post.content}</p>
                        <button onClick={() => handleShowReactions(post)}>Reactions</button>
                        <button onClick={() => handleShowComments(post)}>Comments</button>
                        <button onClick={() => handleToggleReaction(post)}>React</button>
                        {addReaction[post.postId] && (
                            <select value={reactions[post.postId]} onChange={(e) => setReactions(prvState => ({ ...prvState, [post.postId]: e.target.value}))}>
                                <option value="">Select Reaction</option>
                                <option value="like">Like</option>
                                <option value="love">Love</option>
                                <option value="angry">Angry</option>
                                <option value="sad">Sad</option>
                                <option value="care">Care</option>
                            </select>
                        )}
                        <button onClick={() => handleAddComment(post)}>Add Comment</button>
                        {addComment[post.postId] && (
                            <textarea
                              placehoder="Enter your comment"
                              value={comments[post.postId]}
                              onChange={(e) => setComments(prvState => ({ ...prvState, [post.postId]: e.target.value}))}
                            />
                        )}
                        {showReactions[post.postId] && (
                            <div>
                                {post.reactions.length > 0 ? (
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
                                {post.comments.length > 0 ? (
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
                </div>
            ))}
        </div>
    );

}


export default OtherUserPosts;