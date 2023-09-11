import { useState, useEffect } from "react";
import { usePage } from "../hooks/usePage";
import { useCreatePagePostContext } from "../context/CreatePagePostContext";
import CreatePagePost from "../helperComponent/CreatePagePost";
import PagePosts from "../helperComponent/PagePosts";
import Loader from "../helperComponent/Loader";

import "../CSS/pageProfile.css";

const PageProfile = ({ page }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [pageLikers, setPageLikers] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { createPost, setCreatePost } = useCreatePagePostContext();

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  const { getPageAdmin, pageError, pageLoading, getPageLikers, addLike, removeLike, deletePage } = usePage();

  useEffect(() => {
    const asyncFunction = async () => {
        const admin = await getPageAdmin(page.name);
        if (admin === userId) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        const likers = await getPageLikers(page.name);
        setPageLikers(likers);
        if (likers.includes(userId)) {
            setIsLiked(true);
        }
    }

    asyncFunction();

  }, [userId]);

  const handleToggleLike = async () => {
    if (isLiked) {
        await removeLike(page.name);
        if (!pageError) {
            setPageLikers(prvState => prvState.filter(user => user !== userId));
        }
        setIsLiked(false);
    }
    else {
        await addLike(page.name);
        if (!pageError) {
            setPageLikers(prvState => [...prvState, userId]);
        }
        setIsLiked(true);
    }
  }

  const handleDeletePage = async () => {
    deletePage(page.name);
    if (!pageError) {
      setDeleted(true);
    }
  }

  const handleToggleCreatePost = () => {
    setCreatePost(prv => !prv);
  }
  

  if (pageLoading) {
    return <Loader />;
  }

  if (pageError) {
    return <h3>Error: {pageError}</h3>;
  }

  if (deleted) {
    return <h3>The page has been deleted</h3>;
  }

  return (
    <div className="page-profile">
      <h3>Searched Page</h3>
      <span className="page-name"><span className="span">Name: </span> {page.name}</span>
      <span className="page-description"><span className="span">Description: </span>{page.description}</span>
      <span className="page-likes">Likes: {pageLikers.length > 0 ? pageLikers.length : 0}</span>
      <button onClick={handleToggleLike} className={`like-button ${isLiked ? "liked" : ""}`}>
        {isLiked ? "Liked" : "Like"}
      </button>
      {isAdmin && (
        <div className="admin-actions">
          <button onClick={handleDeletePage} className="delete-button">Delete</button>
          <button onClick={handleToggleCreatePost} className="create-post-button2">Create Post</button>
          {createPost && <CreatePagePost pageName={page.name} />}
        </div>
      )}
      <PagePosts pageName={page.name} />
    </div>

  )
}

export default PageProfile