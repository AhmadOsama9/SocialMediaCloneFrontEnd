import { useState } from "react";
import { useUserPostsContext } from "../context/UserPostsContext";


export const usePost = () => {
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
    }

    

    return { getCreatedPosts, postLoading, postError, createPost, deletePost, updatePost, getOtherUserCreatedPosts };

}