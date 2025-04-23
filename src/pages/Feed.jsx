import { useState } from "react";
import UserPosts from '../helperComponent/UserPosts';
import UserSharedPosts from '../helperComponent/UserSharedPosts';
import FeedPosts from "../helperComponent/FeedPosts";
import "../CSS/feed.css";

const Feed = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [
    { id: "feed", label: "Feed", component: <FeedPosts /> },
    { id: "posts", label: "Your Posts", component: <UserPosts /> },
    { id: "shared", label: "Shared Posts", component: <UserSharedPosts /> }
  ];

  return (
    <div className="feed">
      <h3 className="feed__title">Your Feed</h3>
      
      <div className="feed__tabs" data-active-tab={activeTab}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`feed__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="feed__content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Feed;