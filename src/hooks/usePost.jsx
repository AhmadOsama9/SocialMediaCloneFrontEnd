import { useState } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";
import { useOtherUserPostsContext } from "../context/OtherUserPosts";


export const usePost = () => {
    const { reactions, setReactions, comments, setComments} = useOtherUserPostsContext();

    const [postError, setPostError] = useState(null);
    const [postLoading, setPostLoading] = useState(null);
    
    const { setUserPosts } = useUserPostsContext();

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const getCreatedPosts = async () => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getposts?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            setUserPosts(json);
        }
        setPostLoading(false);
    }

    const getOtherUserCreatedPosts = async (otherUserId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getposts?userId=${otherUserId}`, {
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

    const createPost = async (header, content) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({header, content, owner: userId}),
        });

        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const deletePost = async (postId) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/deleteuserpost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
            getCreatedPosts();
        }

        setPostLoading(false);
    }

    const updatePost = async (postId, header, content) => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/update", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId, header, content})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
            getCreatedPosts();
        }

        setPostLoading(false);
    }

    const getPostReactions = async (postId) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/post/reaction/get?postId=${postId}`, {
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

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/post/comment/get?postId=${postId}`, {
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

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/post/comment/get?postId=${postId}`, {
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
        
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/reaction/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId, reactionType})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const updateReaction = async (userNickname, postId, reactionType) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/reaction/update", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId, reactionType})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const deleteReaction = async (userNickname, postId) => {
        setPostError(null);
        setPostLoading(true);
        
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/reaction/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nickname: userNickname, postId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const addComment = async (postId, content) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://merngymprojectbackend.onrender.com/api/post/comment/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId, content})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            return json.commentId;
        }
        setPostLoading(false);
    }
    const updateComment = async (content, commentId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://merngymprojectbackend.onrender.com/api/post/comment/update", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({content, commentId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }
    const deleteComment = async (postId, commentId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await  fetch("https://merngymprojectbackend.onrender.com/api/post/comment/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({postId, commentId})
        });
        const json = await response.json();
        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const addShare = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/share/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId})
        });

        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);
    }

    const removeShare = async (postId) => {
        setPostError(null);
        setPostLoading(true);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/post/share/remove", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId, postId})
        });

        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            alert(json.message);
        }
        setPostLoading(false);

    }

    

    return { getCreatedPosts, postLoading, postError, createPost, deletePost, updatePost, getOtherUserCreatedPosts, getPostReactions, getPostComments,getPostSharesCount, addReaction, updateReaction, deleteReaction, addComment, updateComment, deleteComment, addShare, removeShare };

}