import { useState, useEffect } from "react";
import { useOtherUserPostsContext } from "../context/OtherUserPosts";
import { usePost } from "../hooks/usePost";
import { useGetUserInfo } from "../hooks/useGetUserInfo";


const CommunityPosts = ({ communityId }) => {
    const [communityPosts, setcommunityPosts] = useState([]);
    const { getCommunityPosts , postLoading, postError, getPostReactions, getPostComments, getPostSharesCount, addReaction, updateReaction, deleteReaction, addComment, updateComment, deleteComment, addShare, removeShare, deleteCommunityPost, updatePost} = usePost();
    const {reactions, setReactions, comments, setComments } = useOtherUserPostsContext();

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;
    const [userNickname, setUserNickname] = useState("");

    const { getUserNickname } = useGetUserInfo();

    const [showPostUpdate, setShowUpdate] = useState({});
    const [editedHeaders, setEditedHeaders] = useState({});
    const [editedContents, setEditedContents] = useState({});

    const handleUpdatePost = (post) => {
        setShowUpdate(prvState => ({...prvState, [post.postId]: true}));
        setEditedHeaders(prvState => ({...prvState, [post.postId]: post.header}));
        setEditedContents(prvState => ({...prvState, [post.postId]: post.content}));
    }

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
          const result = await getCommunityPosts(communityId);
          setcommunityPosts(result);
      
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
    }, [communityId]);

    const handleCallPostUpdate = async (post) => {
        if (editedHeaders[post.postId] !== post.header || editedContents[post.postId] !== post.content) {
            await updatePost(post.postId, editedHeaders[post.postId], editedContents[post.postId]);
        } else {
            alert("There's nothing to be updated")
        }
        setShowUpdate(prvState => ({...prvState, [post.postId]: false}));
    }


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
        const post = communityPosts.find(post => post.postId === postId);
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
        return <h3>Loading...</h3>;
    }

    if (postError) {
        return <h3>Error: {postError}</h3>;
    }

    if (communityPosts.length === 0) {
        return <h3>The Community have no Posts</h3>;
    }
    return (
        <div>
            {communityPosts.map((post) => (
              <div>
                {!showPostUpdate[post.postId] && (
                  <div>
                    <div>
                        <h3>Creator: {post.nickname}</h3>
                        <h4>Header: {post.header}</h4>
                        <p>Content: {post.content}</p>
                        {post.nickname === userNickname && (
                            <div>
                              <button onClick={() => handleUpdatePost(post)}>Update</button>
                              <button onClick={() => deleteCommunityPost(post.postId)}>Delete</button>
                            </div>
                        )}
                        <button onClick={() => handleShowReactions(post)}>Reactions</button>
                        <span>
                            {addingReaction[post.postId] ? addingReaction[post.postId].length : 0}
                        </span>

                        <button onClick={() => handleShowComments(post)}>Comments</button>
                        <span> {addingComment[post.postId] ? addingComment[post.postId].length: 0}</span>
                        <button onClick={() => handleToggleShare(post.postId)}>Share</button>
                        <span> {addingShare[post.postId] ? addingShare[post.postId].length : 0}</span>
                        <button onClick={() => handleToggleReaction(post)}>React</button>
                        {showAddReaction[post.postId] && (
                            <select value={reactions[post.postId]} onChange={(e) => handleAddReactionToPost(post.postId, e)}>
                                <option value="select">Select Reaction</option>
                                <option value="like">Like</option>
                                <option value="love">Love</option>
                                <option value="angry">Angry</option>
                                <option value="sad">Sad</option>
                                <option value="care">Care</option>
                                <option value="">Delete</option>
                            </select>
                        )}
                        <button onClick={() => handleAddComment(post)}>Comment</button>
                        {showAddComment[post.postId] && (
                            <div>
                                <textarea
                                placehoder="Enter your comment"
                                value={typeComment}
                                onChange={(e) => setTypeComment(e.target.value)}
                                />
                                <button onClick={() => handleAddCommentToPost(post.postId)}>Comment</button>
                            </div>
                        )}
                        {showReactions[post.postId] && (
                            <div>
                                {addingReaction[post.postId].length > 0 ? (
                                    addingReaction[post.postId].map((reaction) => (
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
                                {addingComment[post.postId].length > 0 ? (
                                    addingComment[post.postId].map((comment) => (
                                        <div>
                                            <h5>onwner: {comment.nickname}</h5>
                                            <h5>content: {comment.content}</h5>
                                            <h5>CreatedAt: {comment.createdAt}</h5>
                                            {comment.nickname === userNickname && (
                                                <div>
                                                    <button onClick={() => handleShowUpdateComment(comment)}>Update</button>
                                                    {showUpdateComment[comment.commentId] && (  
                                                        <div>
                                                            <textarea
                                                              placeholder="Enter your updated comment"
                                                              value={updatedCommentContent}
                                                              onChange={(e) => setUpdatedCommentContent(e.target.value)}
                                                            />
                                                            <button onClick={() => handleUpdateComment(post.postId, comment.commentId)}>save</button>
                                                        </div>
                                                    )}
                                                    <button onClick={() => handleDeleteComment(post.postId, comment.commentId)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No Comments</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                )}
                {showPostUpdate[post.postId] && (
                    <div>
                        <input
                          type="text"
                          value={editedHeaders[post.postId]}
                          onChange={(e) => setEditedHeaders(prvState => ({...prvState, [post.postId]: e.target.value}))}
                        />
                        <textarea
                          value={editedContents[post.postId]}
                          onChange={(e) => setEditedContents(prvState => ({...prvState, [post.postId]: e.target.value}))}
                        />
                        <button onClick={() => handleCallPostUpdate(post)}>Save</button>
                    </div>


                )}
              </div>
            ))}
        </div>
    );

}


export default CommunityPosts;