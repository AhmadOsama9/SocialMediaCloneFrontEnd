import { useState } from "react";


import UserPosts from '../helperComponent/UserPosts';
import UserSharedPosts from '../helperComponent/UserSharedPosts';
import FeedPosts from "../helperComponent/FeedPosts";

const Feed = () => {

  const [activePostsType, setActivePostsType] = useState("");

  const handlePostsTypeToggle = (section) => {
      setActivePostsType(prvType => (prvType === section ? "" : section));
  }
    
  return (
    <div className="feed">
      <h3>Your feed</h3>
      <div>
        <button onClick={() => handlePostsTypeToggle("UserPosts")}>Posts</button>
        <button onClick={() => handlePostsTypeToggle("SharedPosts")}>SharedPosts</button>
      </div>
      <div>
        {activePostsType === "UserPosts" && (
          <UserPosts />
        )}
        {activePostsType === "SharedPosts" && (
          <UserSharedPosts />
        )}
        {!activePostsType === "UserPosts" && !activePostsType === "SharedPosts" && (
          <FeedPosts />
        )}
      </div>

    </div>
  )
}

export default Feed