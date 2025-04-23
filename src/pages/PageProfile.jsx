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
        <div className="page-header">
          <h2 className="page-name">{page.name}</h2>
          <p className="page-description">{page.description}</p>
          
          <div className="page-stats">
            <div className="page-stat">
              <div className="page-stat-value">{pageLikers.length}</div>
              <div className="page-stat-label">Likes</div>
            </div>
          </div>
        </div>
        
        <div className="page-actions">
          <button 
            onClick={handleToggleLike} 
            className={`page-button like-button ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>
          
          {isAdmin && (
            <>
              <button 
                onClick={handleToggleCreatePost} 
                className="page-button create-button"
              >
                {createPost ? "Cancel" : "Create Post"}
              </button>
              
              <button 
                onClick={handleDeletePage} 
                className="page-button delete-button"
              >
                Delete Page
              </button>
            </>
          )}
        </div>
        {createPost && isAdmin && (
        <div className="create-post-container">
          <CreatePagePost pageName={page.name} />
        </div>
      )}
      
      <div className="page-posts-container">
        <PagePosts pageName={page.name} />
      </div>
    </div>
  );
}


export default PageProfile