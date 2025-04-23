import { useState, useEffect } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { usePost } from "../hooks/usePost";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "../pages/OtherUserProfile";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { formatDate } from "./formDate";
import { getReactionEmoji } from "./getReactionEmoji";
import notification from "../helperComponent/notification";
import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4, avatar0 } from "../assets/avatar";

import "../CSS/postStyles.css";

const UserSharedPosts = () => {
    const { sharedPosts } = useUserPostsContext();
    const { getSharedPosts, postLoading, postError, addReaction, addComment, addShare, updateReaction, updateComment, deleteReaction, deleteComment, removeShare } = usePost();
    const { isLoading, error, user, searchUserAndReturn } = useSearchUser();

    const [showUpdate, setShowUpdate] = useState({});

    const [editedHeaders, setEditedHeaders] = useState({});
    const [editedContents, setEditedContents] = useState({});

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;
    const [userNickname, setUserNickname] = useState("");

    const [userClicked, setUserClicked] = useState(false);
    const [searchedUser, setSearchedUser] = useState(null);

    const handleNicknameClicking = async (nickname) => {
        const user = await searchUserAndReturn(nickname);
        setSearchedUser(user);
        setUserClicked(true);
    }

    const { getUserNickname } = useGetUserInfo();

    const getNickname = async () => {
        const nickname = await getUserNickname(userId);
        setUserNickname(nickname);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            await getSharedPosts();

            for (const post of sharedPosts) {
                setAddingReaction(prvState => ({ ...prvState, [post.postId]: post.reactions }));
    
                setAddingComment(prvState => ({ ...prvState, [post.postId]: post.comments }));
    
                setAddingShare(prvState => ({ ...prvState, [post.postId]: post.shares }));
            }
        }
        fetchPosts();
        getNickname();
    }, []);

    const [showReactions, setShowReactions] = useState({});
    const [showComments, setShowComments] = useState({});
    const [showAddReaction, setShowAddReaction] = useState({});
    const [showAddComment, setShowAddComment] = useState({});
    const [addingReaction, setAddingReaction] = useState({});
    const [addingComment, setAddingComment] = useState({});
    const [showUpdateComment, setShowUpdateComment] = useState({});

    const [addingShare, setAddingShare] = useState({});

    const [updatedCommentContent, setUpdatedCommentContent] = useState("");
    const [typeComment, setTypeComment] = useState("");

    const handleShowReactions = (post) => {
        setShowReactions(prvState => ({...prvState, [post.postId]: !prvState[post.postId] }));
    }

    const handleShowComments = (post) => {
        setShowComments(prvState => ({...prvState, [post.postId]: !prvState[post.postId] }));
    }

    const handleShowUpdateComment = (comment) => {
        setShowUpdateComment(prvState => ({...prvState, [comment.commentId]: true}));
        setUpdatedCommentContent(comment.content);
    }

    const handleToggleReaction = (post) => {
        setShowAddReaction(prvState => ({...prvState, [post.postId]: !prvState[post.postId]}));
    }

    const handleAddComment = (post) => {
        setShowAddComment(prvState => ({ ...prvState, [post.postId]: !prvState[post.postId]}));
    }

    const handleAddReactionToPost = async (postId, e) => {
        const existingReactions = addingReaction[postId] || [];

        const userReaction = existingReactions.find(reaction => reaction.nickname === userNickname);

        if (e.target.value === "select") {
            notification.error("You didn't select anything");
            return;
        }

        if (userReaction) {
            if (e.target.value === userReaction.reaction) {
                return;
            } else if (e.target.value === "") {
                await deleteReaction(userNickname, postId);
                if (!postError) {
                    setAddingReaction(prvState => ({
                        ...prvState,
                        [postId]: prvState[postId].filter(reaction => reaction.nickname !== userNickname)
                    }));
                }
            } else {
                await updateReaction(userNickname, postId, e.target.value);
                if (!postError) {
                    setAddingReaction(prvState => ({
                        ...prvState,
                        [postId]: prvState[postId].map(reaction =>
                            reaction.nickname === userNickname
                                ? { ...reaction, reaction: e.target.value }
                                : reaction
                        )
                    }));
                }
            }
        }
        else if (e.target.value === "" && !userReaction) {
            notification.error("You didn't react to remove");
        } else {
            await addReaction(userNickname, postId, e.target.value);
            if (!postError) {
                setAddingReaction(prvState => ({
                    ...prvState,
                    [postId]: [...(prvState[postId] || []), { nickname: userNickname, reaction: e.target.value }]
                }));
            }
        }
    };

    const handleAddCommentToPost = async (postId) => {
        const commentId = await addComment(postId, typeComment);
        if (!postError) {
            setAddingComment(prvState => ({ ...prvState, [postId]: [...(prvState[postId] || []), { nickname: userNickname, content: typeComment, commentId: commentId}]}))
        }
        setTypeComment("");
    }

    const handleUpdateComment = async (postId, commentId) => {
        const existingComment = addingComment[postId]?.find(comment => comment.commentId === commentId);
    
        if (!existingComment) {
            setShowUpdateComment(prvState => ({...prvState, [commentId]: false}));
            return;
        }
    
        if (existingComment.content === updatedCommentContent) {
            notification.error("No Changes to be saved");
            setShowUpdateComment(prvState => ({...prvState, [commentId]: false}));
            return;
        }
    
        await updateComment(updatedCommentContent, commentId);
        if (!postError) {
            setAddingComment(prvState => ({
                ...prvState,
                [postId]: prvState[postId].map(comment =>
                    comment.commentId === commentId
                        ? { ...comment, content: updatedCommentContent }
                        : comment
                )
            }));
        }
        setShowUpdateComment(prvState => ({...prvState, [commentId]: false}));

        setUpdatedCommentContent("");
    };

    const handleDeleteComment = async (postId, commentId) => {
        await deleteComment(postId, commentId);
        if (!postError) {
            setAddingComment(prvState => ({ ...prvState, [postId]: prvState[postId].filter(comment => comment.commentId !== commentId)
            }))
        }
    }

    const handleToggleShare = async (postId) => {
        const post = sharedPosts.find(post => post.postId === postId);
        const currentUserId = userId;
        
        if (!post) {
            console.log("Post not found");
            return;
        }
        const userShares = addingShare[postId] || [];
    
        const userIndex = userShares.findIndex(share => share.userId === currentUserId);
    
        if (userIndex !== -1) {
            await removeShare(postId);
            if (!postError) {
                setAddingShare(prvState => ({
                    ...prvState,
                    [postId]: prvState[postId].filter(user => user.userId !== currentUserId)
                }));
            }
        } else {
            await addShare(postId);
            if (!postError) {
                setAddingShare(prvState => ({
                    ...prvState,
                    [postId]: [...(prvState[postId] || []), {userId: currentUserId}]
                }));
            }
        }
    };

    if (postLoading) {
        return <Loader />;
    }

    if (postError) {
        return <h3 className="error">Error: {postError}</h3>;
    }

    if (sharedPosts.length === 0) {
        return <h3 className="no-posts-message">You have no shared posts</h3>;
    }
    
    return (
        <div>
            {!userClicked && (
                <div className="post-list">
                {sharedPosts.map((post) => (
                    <div className="post-card" key={post.postId}>
                        <div className="post-header">
                            <div className="post-author">
                                <div className="avatar-container">
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
                                            : avatar0
                                        }
                                        alt={`Avatar`}
                                        className="avatar-image"
                                    />
                                </div>
                                <div className="author-info">
                                    <h3 className="author-name clickable" onClick={() => handleNicknameClicking(post.nickname)}>{post.nickname}</h3>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                </div>
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
                                    {addingReaction[post.postId] ? addingReaction[post.postId].length : 0}
                                </span>
                            </div>
                            <div className="stats-counters">
                                <span onClick={() => handleShowComments(post)}>
                                    {addingComment[post.postId]?.length || 0} comments
                                </span>
                                <span>
                                    {addingShare[post.postId]?.length || 0} shares
                                </span>
                            </div>
                        </div>
                        
                        <div className="post-interaction-bar">
                            <button onClick={() => handleShowReactions(post)} className="interaction-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                </svg>
                                <span>Reactions</span>
                            </button>
                            
                            <button onClick={() => handleShowComments(post)} className="interaction-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>Comments</span>
                            </button>
                            
                            <button onClick={() => handleToggleShare(post.postId)} className="interaction-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                <span>Share</span>
                            </button>
                            
                            <button onClick={() => handleToggleReaction(post)} className="interaction-button">
                                React
                            </button>
                            
                            <button onClick={() => handleAddComment(post)} className="interaction-button">
                                Comment
                            </button>
                        </div>
                        
                        {showAddReaction[post.postId] && (
                            <div className="reaction-selector">
                                <div className="reaction-buttons">
                                    <button 
                                        className="reaction-button" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: 'like'}})}
                                        title="Like"
                                    >
                                        {getReactionEmoji('like')} 
                                    </button>
                                    <button 
                                        className="reaction-button" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: 'love'}})}
                                        title="Love"
                                    >
                                        {getReactionEmoji('love')}
                                    </button>
                                    <button 
                                        className="reaction-button" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: 'angry'}})}
                                        title="Angry"
                                    >
                                        {getReactionEmoji('angry')}
                                    </button>
                                    <button 
                                        className="reaction-button" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: 'sad'}})}
                                        title="Sad"
                                    >
                                        {getReactionEmoji('sad')}
                                    </button>
                                    <button 
                                        className="reaction-button" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: 'care'}})}
                                        title="Care"
                                    >
                                        {getReactionEmoji('care')}
                                    </button>
                                    <button 
                                        className="reaction-button delete-reaction" 
                                        onClick={() => handleAddReactionToPost(post.postId, {target: {value: ''}})}
                                        title="Remove Reaction"
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {showAddComment[post.postId] && (
                            <div className="comment-form">
                                <textarea
                                    className="comment-textarea"
                                    placeholder="Enter your comment"
                                    value={typeComment}
                                    onChange={(e) => setTypeComment(e.target.value)}
                                />
                                <button className="comment-submit-button" onClick={() => handleAddCommentToPost(post.postId)}>Comment</button>
                            </div>
                        )}
                        
                        {showReactions[post.postId] && (
                            <div className="reactions-list">
                                <h5 className="section-title">Reactions</h5>
                                {addingReaction[post.postId] && addingReaction[post.postId].length > 0 ? (
                                    addingReaction[post.postId].map((reaction, index) => (
                                        <div className="reaction-item" key={reaction.nickname + index}>
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
                                {addingComment[post.postId] && addingComment[post.postId].length > 0 ? (
                                    addingComment[post.postId].map((comment) => (
                                        <div className="comment-item" key={comment.commentId}>
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.nickname}</span>
                                                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p className="comment-text">{comment.content}</p>
                                            {comment.nickname === userNickname && (
                                                <div className="comment-actions">
                                                    <button className="comment-action-button" onClick={() => handleShowUpdateComment(comment)}>Update</button>
                                                    {showUpdateComment[comment.commentId] && (
                                                        <div className="comment-edit-form">
                                                            <textarea
                                                                className="comment-textarea"
                                                                placeholder="Enter your updated comment"
                                                                value={updatedCommentContent}
                                                                onChange={(e) => setUpdatedCommentContent(e.target.value)}
                                                            />
                                                            <button className="comment-submit-button" onClick={() => handleUpdateComment(post.postId, comment.commentId)}>Save</button>
                                                        </div>
                                                    )}
                                                    <button className="comment-action-button" onClick={() => handleDeleteComment(post.postId, comment.commentId)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-items-message">No Comments</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                </div>
            )}
            {userClicked && (
                <OtherUserProfile otherUser={searchedUser} relation="None"/>
            )}
        </div>
    );
}

export default UserSharedPosts;