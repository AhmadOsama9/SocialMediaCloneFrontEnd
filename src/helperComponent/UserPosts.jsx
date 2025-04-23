import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";
import notification from "../helperComponent/notification";
import Loader from "../helperComponent/Loader";
import { getReactionEmoji } from "./getReactionEmoji";
import { formatDate } from "./formDate";

import { avatar1, avatar2, avatar3, avatar4, avatar0 } from "../assets/avatar";

// Import both CSS files
import "../CSS/userPost.css";
import "../CSS/postStyles.css";

const UserPosts = () => {
    const [userPosts, setUserPosts] = useState([]);
    const { getCreatedPosts, postLoading, postError, deletePost, updatePost } = usePost();

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
            const result = await getCreatedPosts();
            setUserPosts(result);

            for (const post of result) {
                setReactions(prvState => ({ ...prvState, [post.postId]: post.reactions }));
                setComments(prvState => ({ ...prvState, [post.postId]: post.comments }));
                setShares(prvState => ({ ...prvState, [post.postId]: post.shares }));
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
            notification.info("There's nothing to be updated");
        }
        setShowUpdate(prvState => ({...prvState, [post.postId]: false}));
    }

    const handleCancelUpdate = (postId) => {
        setShowUpdate(prvState => ({...prvState, [postId]: false}));
    }

    if (postLoading) {
        return <Loader />;
    }

    if (postError) {
        return <h3 className="error">Error: {postError}</h3>;
    }

    if (userPosts.length === 0) {
        return <h3 className="no-posts-message">You have no Posts</h3>;
    }

    return (
        <div className="post-list">
            {userPosts.map((post) => (
                <div key={post.postId} className="post-card">
                    {!showUpdate[post.postId] && (
                        <div>
                            <div className="post-header">
                                <div className="post-author">
                                    <div className="avatar-container">
                                        <img
                                            src={
                                                post.avatar === "1" ? avatar1 :
                                                post.avatar === "2" ? avatar2 :
                                                post.avatar === "3" ? avatar3 :
                                                post.avatar === "4" ? avatar4 : avatar0
                                            }
                                            alt={`Avatar`}
                                            className="avatar-image"
                                        />
                                    </div>
                                    <div className="author-info">
                                        <h3 className="author-name">{post.nickname}</h3>
                                        <span className="post-date">{formatDate(post.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="post-actions">
                                    <button 
                                        className="action-button edit-button" 
                                        onClick={() => handleUpdate(post)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                        <span>Edit</span>
                                    </button>
                                    <button 
                                        className="action-button delete-button" 
                                        onClick={() => deletePost(post.postId)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="post-content">
                                <h4 className="post-title">{post.header}</h4>
                                <p className="post-body">{post.content}</p>
                            </div>

                            <div className="post-stats">
                                <div className="stats-item" onClick={() => handleShowReactions(post)}>
                                    <div className="reaction-icons">
                                        {post.reactions && post.reactions.length > 0 && post.reactions.slice(0, 3).map((reaction, index) => (
                                            <span key={index} className="reaction-icon">
                                                {getReactionEmoji(reaction.reaction)}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="stats-count">
                                        {reactions[post.postId]?.length > 0 ? reactions[post.postId].length : 0}
                                    </span>
                                </div>
                                <div className="stats-counters">
                                    <span onClick={() => handleShowComments(post)}>
                                        {comments[post.postId]?.length || 0} comments
                                    </span>
                                    <span>
                                        {shares[post.postId]?.length || 0} shares
                                    </span>
                                </div>
                            </div>

                            <div className="post-interaction-bar">
                                <button 
                                    onClick={() => handleShowReactions(post)} 
                                    className="interaction-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                    </svg>
                                    <span>Reactions</span>
                                </button>

                                <button 
                                    onClick={() => handleShowComments(post)} 
                                    className="interaction-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Comments</span>
                                </button>

                                <button className="interaction-button" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="18" cy="5" r="3"></circle>
                                        <circle cx="6" cy="12" r="3"></circle>
                                        <circle cx="18" cy="19" r="3"></circle>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                    <span>Shares</span>
                                </button>
                            </div>

                            {showReactions[post.postId] && (
                                <div className="reactions-list">
                                    <h5 className="section-title">Reactions</h5>
                                    {reactions[post.postId]?.length > 0 ? (
                                        reactions[post.postId].map((reaction, index) => (
                                            <div key={index} className="reaction-item">
                                                <span className="reaction-emoji">
                                                    {getReactionEmoji(reaction.reaction)}
                                                </span>
                                                <span className="reaction-name">{reaction.nickname}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-items-message">No Reactions</p>
                                    )}
                                </div>
                            )}
                            
                            {showComments[post.postId] && (
                                <div className="comments-list">
                                    <h5 className="section-title">Comments</h5>
                                    {comments[post.postId]?.length > 0 ? (
                                        comments[post.postId].map((comment) => (
                                            <div key={comment.commentId} className="comment-item">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.nickname}</span>
                                                    <span className="comment-date">{comment.createdAt || "Just now"}</span>
                                                </div>
                                                <p className="comment-text">{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-items-message">No Comments</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {showUpdate[post.postId] && (
                        <div className="comment-form">
                            <div className="edit-field">
                                <label>Header</label>
                                <input 
                                    type="text"
                                    value={editedHeaders[post.postId]}
                                    onChange={(e) => setEditedHeaders(prevState => ({ ...prevState, [post.postId]: e.target.value }))}
                                    className="comment-textarea"
                                />
                            </div>
                            
                            <div className="edit-field">
                                <label>Content</label>
                                <textarea
                                    value={editedContents[post.postId]}
                                    onChange={(e) => setEditedContents(prevState => ({ ...prevState, [post.postId]: e.target.value }))}
                                    className="comment-textarea"
                                />
                            </div>
                            
                            <div className="comment-form-actions">
                                <button 
                                    onClick={() => handleCallUpdate(post)} 
                                    className="comment-submit-button"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => handleCancelUpdate(post.postId)} 
                                    className="comment-cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default UserPosts;
