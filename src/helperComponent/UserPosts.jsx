import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";

import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4 } from "../assets/avatar";

import "../CSS/updatePost.css";


const UserPosts = () => {
    const { userPosts } = useUserPostsContext();
    const { getCreatedPosts, postLoading, postError, deletePost, updatePost, getPostReactions, getPostComments, getPostSharesCount } = usePost();

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
            await getCreatedPosts();

            for (const post of userPosts) {
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
        return <Loader />;
    }

    if (postError) {
        return <h3 className=".error">Error: {postError}</h3>;
    }

    if (userPosts.length === 0) {
        return <h3>You have no Posts</h3>;
    }
    return (
        <div>
            {userPosts.map((post) => (
                <div className="post">
                    <button className="post-button" onClick={() => handleUpdate(post)}>Update</button>
                    <button className="post-button" onClick={() => deletePost(post.postId)}>Delete</button>
                    {!showUpdate[post.postId] && (
                    <div>
                      <div className="post-header">
                        <div className="post-first-row">
                            <span  className="post-selected-avatar">
                                <img
                                    src={
                                    post.avatar === "1"
                                        ? avatar1
                                        : post.avatar === "2"
                                        ? avatar2
                                        : post.avatar === "3"
                                        ? avatar3
                                        : post.avatar === "4"
                                        ? avatar4
                                        : null
                                    }
                                    alt={`Avatar}`}
                                    className="selected-avatar-image"
                                />
                            </span>
                            <h3 className="post-creator">{post.nickname}</h3>
                            <span className="post-created">
                                {post.createdAt}
                            </span>
                        </div>
                        <h4 className="post-header-text">Header: {post.header}</h4>
                        <p className="post-content"><span className="content">Content: </span> {post.content}</p>
                      </div>
                        <button onClick={() => handleShowReactions(post)} className="post-button">Reactions</button>
                        <span className="post-count">{reactions.length > 0 ? reactions.length : 0}</span>
                        <button onClick={() => handleShowComments(post)} className="post-button">Comments</button>
                        <span className="post-count">{comments.length > 0 ? comments.length : 0}</span>
                        <span className="post-count"><span className="span">Shares</span> {shares.length > 0 ? shares.length : 0}</span>

                        {showReactions[post.postId] && (
                            <div className="post-reactions">
                            {reactions > 0 ? (
                                post.reactions.map((reaction) => (
                                <div key={reaction.nickname}>
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
                            <div className="post-comments">
                            {comments > 0 ? (
                                post.comments.map((comment) => (
                                <div key={comment.commentId}>
                                    <h5>owner: {comment.nickname}</h5>
                                    <h5>content: {comment.content}</h5>
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
                        <div className="edit-post-container">
                        <input 
                            type="text"
                            value={editedHeaders[post.postId]}
                            onChange={(e) => setEditedHeaders(prevState => ({ ...prevState, [post.postId]: e.target.value }))}
                            className="edit-post-input"
                        />
                        <textarea
                            value={editedContents[post.postId]}
                            onChange={(e) => setEditedContents(prevState => ({ ...prevState, [post.postId]: e.target.value }))}
                            className="edit-post-textarea"
                        />
                        <button onClick={() => handleCallUpdate(post)} className="edit-post-button">Save</button>
                    </div>
                    
                    )}
                </div>

            ))}
        </div>
    );

}


export default UserPosts;