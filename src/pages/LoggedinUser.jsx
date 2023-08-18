import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Friends from "../helperComponent/friends";
import ShowJoinedCommunities from "../helperComponent/ShowJoinedCommunities";
import SearchCommunity from "../helperComponent/SearchCommunity";
import SearchUser from "../helperComponent/SearchUser";
import ShowAllCommunities from "../helperComponent/ShowAllCommunities";
import CreateCommunity from "../helperComponent/CreateCommunity";
import CreatePost from "../helperComponent/CreatePost";
import CreatePage from "../helperComponent/CreatePage";
import SearchedPage from "../helperComponent/searchedPage";
import { useActiveSectionContext } from "../context/ActiveSectionContext";

import "../CSS/loggedinUser.css";

const LoggedinUser = () => {
  const {activeSection, setActiveSection} = useActiveSectionContext();

  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleSearchIconClick = () => {
    if (searchType === "user") {
      handleSectionToggle("searchUser");
    } else if (searchType === "community") {
      handleSectionToggle("searchCommunity");
    } else if (searchType === "page") {
      handleSectionToggle("searchPage");
    } else {
      handleSectionToggle("");
    }
  }

  const handleClearActiveSection = () => {
    setSearchText("");
  }

  return (
    <div className="loggedin-user">
      {!activeSection ? (
        <div className="loggedin-user-choices">
          <div className="search">
            <input
              type="text"
              placeholder="Search for a user by nickname"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="community">Community</option>
              <option value="page">Page</option>
            </select>
            <button onClick={() => handleSearchIconClick}><FaSearch /></button>
          </div>

          <button onClick={() => handleSectionToggle("communities")}>Joined Communities</button>

          <button onClick={() => handleSectionToggle("showAllCommunities")}>Show All Communities</button>

          <button onClick={() => handleSectionToggle("createCommunity")}>Create Community</button>
          
          <button onClick={() => handleSectionToggle("createPost")}>Create Post</button>

          <button onClick={() => handleSectionToggle("createPage")}>Create Page</button>
        </div>
      ) : (
        <div className="active-section-wrapper">
          <button onClick={handleClearActiveSection} className="close-btn">Close Section</button>

          {activeSection === "communities" && (
            <ShowJoinedCommunities />
          )}
          {activeSection === "searchUser" && (
            <SearchUser nickname={searchText} />
          )}
          {activeSection === "searchCommunity" && (
            <SearchCommunity name={searchText} />
          )}
          {activeSection === "searchPage" && (
            <SearchedPage name={searchText} />
          )}
          {activeSection === "showAllCommunities" && (
            <ShowAllCommunities />
          )}
          {activeSection === "createCommunity" && (
            <CreateCommunity />
          )}
          {activeSection === "createPost" && (
            <CreatePost />
          )}
          {activeSection === "createPage" && (
            <CreatePage />
          )}

        </div>
      )}
    </div>
  );
};

export default LoggedinUser;
