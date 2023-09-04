import { useState } from "react";


import UserPosts from '../helperComponent/UserPosts';
import UserSharedPosts from '../helperComponent/UserSharedPosts';
import FeedPosts from "../helperComponent/FeedPosts";

import "../CSS/feed.css";

const Feed = () => {

  const [activePostsType, setActivePostsType] = useState("Feed");

  const handlePostsTypeToggle = (section) => {
    setActivePostsType(prvType => (prvType === section ? "" : section));
  }

  return (
    <div className="feed">
      <h3 className="h3">Your feed</h3>
      <div className="toggle-buttons">
        <button onClick={() => handlePostsTypeToggle("UserPosts")}>Posts</button>
        <button onClick={() => handlePostsTypeToggle("SharedPosts")}>SharedPosts</button>
        <button onClick={() => handlePostsTypeToggle("Feed")}>Feed</button>
      </div>
      <div>
        {activePostsType === "UserPosts" && (
          <UserPosts />
        )}
        {activePostsType === "SharedPosts" && (
          <UserSharedPosts />
        )}
        {activePostsType === "Feed" && (
          <FeedPosts />
        )}
      </div>

    </div>
  )
}

export default Feed