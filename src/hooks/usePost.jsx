import { useState, useEffect } from "react";


export const usePost = () => {
    const [postError, setPostError] = useState(null);
    const [postLoading, setPostLoading] = useState(null);
    const [posts, setPosts] = useState([]);

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    useEffect(() => {
        getPosts();
    }, [])

    const getPosts = async () => {
        setPostError(null);
        setPostLoading(true);
        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/post/getposts?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        const json = await response.json();

        if (!response.ok) {
            setPostError(json.error);
        } else {
            setPosts(json);
        }
        setPostLoading(false);
    }

    

    return { posts, postLoading, postError };

}