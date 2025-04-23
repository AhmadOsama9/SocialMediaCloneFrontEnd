import { useState } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { useOtherUserPostsContext } from "../context/OtherUserPosts";
import { useActiveSectionContext } from "../context/ActiveSectionContext";

import notification from "../helperComponent/notification";

export const usePost = () => {
    const { reactions, setReactions, comments, setComments} = useOtherUserPostsContext();
    const { setActiveSection } = useActiveSectionContext();

    const [postError, setPostError] = useState(null);
    const [postLoading, setPostLoading] = useState(null);
    
    const { setUserPosts, setSharedPosts } = useUserPostsContext();

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const getCreatedPosts = async () => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getposts?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            setUserPosts(json);
            setPostLoading(false);
            return json;
        }
        setPostLoading(false);
    }

    const getSharedPosts = async () => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getsharedposts?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            setSharedPosts(json);
        }
        setPostLoading(false);

    }

    const getOtherUserCreatedPosts = async (otherUserId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getposts?userId=${otherUserId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();
        let results = [];

        if (!response.ok) {
            setPostError(json.error);
        } else {
            results = json;
        }
        setPostLoading(false);
        return results;
    } 
    const getOtherUserSharedPosts = async (otherUserId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getsharedposts?userId=${otherUserId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
            setPostLoading(false);
        } else {
            setPostLoading(false);
            return json;
        }
    } 


    const getCommunityPosts = async (communityId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/community/getcreatedposts?communityId=${communityId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();
        let results = [];

        if (!response.ok) {
            setPostError(json.error);
        } else {
            results = json;
        }
        setPostLoading(false);
        return results;
    }

    const getPagePosts = async (name) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/page/posts?name=${name}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        const json = await response.json();
        let results = [];

        if (!response.ok) {
            setPostError(json.error);
        } else {
            results = json;
        }
        setPostLoading(false)
        return results;

    }
    const getFeedPosts = async (currentPageNumber) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getfeedposts?userId=${userId}&page=${currentPageNumber}`, {
            method: "GET",
            headers: {"Content-Type": "applicationn/json"}
        });
        const json = await response.json();
        let results = [];

        if (!response.ok) {
            setPostError(json.error);
        } else {
            results = json;
        }
        setPostLoading(false);
        return results;
    }


    const createPost = async (header, content) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({header, content, owner: userId}),
        });

        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
            setActiveSection("");
        }
        setPostLoading(false);
    }

    const addPost = async (header, content, communityId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({header, content, owner: userId, communityId})
        });
        
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }

    const createPagePost = async (pageName, header, content) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/createpagepost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({pageName, header, content})
        });
        
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }

    const deletePost = async (postId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/deleteuserpost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
            getCreatedPosts();
        }

        setPostLoading(false);
    }

    const deleteCommunityPost = async (postId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/deletecommunitypost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
            getCreatedPosts();
        }

        setPostLoading(false);
    }

    const deletePagePost = async (pageName, postId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/deletepagepost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ pageName, postId })
        });

        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }

        setPostLoading(false);
    }

    const updatePost = async (postId, header, content) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/update", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId, header, content})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
            getCreatedPosts();
        }

        setPostLoading(false);
    }

    const getPostReactions = async (postId) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/post/reaction/get?postId=${postId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
            setPostLoading(false);
        } else {
            setPostLoading(false);
            return json;
        }

    }

    const getPostComments = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/post/comment/get?postId=${postId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
            setPostLoading(false);
        } else {
            setPostLoading(false);
            return json;
        }

    }

    const getPostSharesCount = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/post/share/get?postId=${postId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        const json = await response.json();
        
        if (!response.ok) {
            setPostError(json.error);
            setPostLoading(false);
        } else {
            setPostLoading(false);
            return json;
        }
    }

    const addReaction = async (userNickname, postId, reactionType) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/reaction/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId, reactionType})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }

    const updateReaction = async (userNickname, postId, reactionType) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/reaction/update", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId, reactionType})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }

    const deleteReaction = async (userNickname, postId) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/reaction/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            anotification.successlert(json.message);
        }
        setPostLoading(false);
    }

    const addComment = async (postId, content) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://socialmediaclonebackend.onrender.com/api/post/comment/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId, content})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
            setPostLoading(false);
        } else {
            setPostLoading(false);
            return json.commentId;
        }
    }
    const updateComment = async (content, commentId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://socialmediaclonebackend.onrender.com/api/post/comment/update", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({content, commentId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }
    const deleteComment = async (postId, commentId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://socialmediaclonebackend.onrender.com/api/post/comment/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId, commentId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alenotification.successrt(json.message);
        }
        setPostLoading(false);
    }

    const addShare = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/share/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId})
        });

        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);
    }

    const removeShare = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/post/share/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId})
        });

        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            notification.success(json.message);
        }
        setPostLoading(false);

    }

    

    return { getCreatedPosts, getSharedPosts, getCommunityPosts, postLoading, postError, createPost, addPost, createPagePost, deletePost, deleteCommunityPost, deletePagePost, updatePost, getOtherUserCreatedPosts, getOtherUserSharedPosts, getPostReactions, getPostComments,getPostSharesCount, addReaction, updateReaction, deleteReaction, addComment, updateComment, deleteComment, addShare, removeShare, getPagePosts, getFeedPosts };

}