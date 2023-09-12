import { useState, useEffect } from "react";
import { useOtherUserPostsContext } from "../context/OtherUserPosts";
import { usePost } from "../hooks/usePost";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import Loader from "../helperComponent/Loader";



const OtherUserSharedPosts = ({ otherUser }) => {
    const [otherUserSharedPosts, setOtherUserSharedPosts] = useState([]);
    const { getOtherUserSharedPosts, postLoading, postError, getPostReactions, getPostComments, getPostSharesCount, addReaction, updateReaction, deleteReaction, addComment, updateComment, deleteComment, addShare, removeShare} = usePost();
    const {reactions, setReactions, comments, setComments } = useOtherUserPostsContext();

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;
    const [userNickname, setUserNickname] = useState("");

    const { getUserNickname } = useGetUserInfo();

    const getNickname = async () => {
        const nickname = await getUserNickname(userId);
        setUserNickname(nickname);
    }

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

    useEffect(() => {
        const fetchOtherUserPosts = async () => {
          const result = await getOtherUserSharedPosts(otherUser.user);
          setOtherUserSharedPosts(result);
      
          for (const post of result) {
            const reactions = await getPostReactions(post.postId);
            setAddingReaction(prvState => ({ ...prvState, [post.postId]: reactions }));

            const comments = await getPostComments(post.postId);
            setAddingComment(prvState => ({ ...prvState, [post.postId]: comments }));

            const results = await getPostSharesCount(post.postId);
            setAddingShare(prvState => ({ ...prvState, [post.postId]: results }));
          }
        }
      
        fetchOtherUserPosts();
        getNickname();
    }, [otherUser.user]);


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
            alert("You didn't select anything");
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
            alert("You didn't react to remove");
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
            alert("No Changes to be saved");
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
        const post = otherUserPosts.find(post => post.postId === postId);
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
        return <h3 className=".error">Error: {postError}</h3>;
    }

    if (otherUserSharedPosts.length === 0) {
        return <h3>The User have no Shared Posts</h3>;
    }
    return (
        <div>
            {otherUserSharedPosts.map((post) => (
                <div className="post">
                    <div className="post-header">
                        <h3 className="post-creator">Creator: {post.nickname}</h3>
                        <h4 className="post-header-text">Header: {post.header}</h4>
                        <p className="post-content"><span className="content">Content: </span> {post.content}</p>
                    </div>
                    <div className="post-buttons">
                        <div className="basic-buttons">
                            <button className="post-button" onClick={() => handleShowReactions(post)}>Reactions</button>
                            <span className="post-button-count">
                            {addingReaction[post.postId] ? addingReaction[post.postId].length : 0}
                            </span>

                            <button className="post-button" onClick={() => handleShowComments(post)}>Comments</button>
                            <span className="post-button-count">
                            {addingComment[post.postId] ? addingComment[post.postId].length : 0}
                            </span>

                            <button className="post-button" onClick={() => handleToggleShare(post.postId)}>Share</button>
                            <span className="post-button-count">
                            {addingShare[post.postId] ? addingShare[post.postId].length : 0}
                            </span>
                        </div>

                        <button className="post-button" onClick={() => handleToggleReaction(post)}>React</button>
                        {showAddReaction[post.postId] && (
                        <select className="post-select" value={reactions[post.postId]} onChange={(e) => handleAddReactionToPost(post.postId, e)}>
                            <option value="select">Select Reaction</option>
                            <option value="like">Like</option>
                            <option value="love">Love</option>
                            <option value="angry">Angry</option>
                            <option value="sad">Sad</option>
                            <option value="care">Care</option>
                            <option value="">Delete</option>
                        </select>
                        )}

                        <button className="post-button" onClick={() => handleAddComment(post)}>Comment</button>
                        {showAddComment[post.postId] && (
                        <div className="post-comment">
                            <textarea
                            className="post-comment-textarea"
                            placeholder="Enter your comment"
                            value={typeComment}
                            onChange={(e) => setTypeComment(e.target.value)}
                            />
                            <button className="post-comment-button" onClick={() => handleAddCommentToPost(post.postId)}>Comment</button>
                        </div>
                        )}
                    </div>
                    {showReactions[post.postId] && (
                        <div className="post-reactions">
                        {addingReaction[post.postId] && addingReaction[post.postId].length > 0 ? (
                            addingReaction[post.postId].map((reaction) => (
                            <div className="post-reaction" key={reaction.nickname}>
                                <h5 className="post-reaction-owner">Owner: {reaction.nickname}</h5>
                                <h5 className="post-reaction-text">Reaction: {reaction.reaction}</h5>
                            </div>
                            ))
                        ) : (
                            <p className="post-no-reactions">No Reactions</p>
                        )}
                        </div>
                    )}
                    {showComments[post.postId] && (
                        <div className="post-comments">
                        {addingComment[post.postId] && addingComment[post.postId].length > 0 ? (
                            addingComment[post.postId].map((comment) => (
                            <div className="post-comment" key={comment.commentId}>
                                <h5 className="post-comment-owner">Owner: {comment.nickname}</h5>
                                <h5 className="post-comment-content">Content: {comment.content}</h5>
                                {comment.nickname === userNickname && (
                                <div className="post-comment-actions">
                                    <button className="post-comment-action-button" onClick={() => handleShowUpdateComment(comment)}>Update</button>
                                    {showUpdateComment[comment.commentId] && (
                                    <div className="post-comment-update">
                                        <textarea
                                        className="post-comment-update-textarea"
                                        placeholder="Enter your updated comment"
                                        value={updatedCommentContent}
                                        onChange={(e) => setUpdatedCommentContent(e.target.value)}
                                        />
                                        <button className="post-comment-update-button" onClick={() => handleUpdateComment(post.postId, comment.commentId)}>Save</button>
                                    </div>
                                    )}
                                    <button className="post-comment-action-button" onClick={() => handleDeleteComment(post.postId, comment.commentId)}>Delete</button>
                                </div>
                                )}
                            </div>
                            ))
                        ) : (
                            <p className="post-no-comments">No Comments</p>
                        )}
                        </div>
                    )}
                    </div>

            ))}
        </div>
    );

}


export default OtherUserSharedPosts;