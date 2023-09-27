import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ShowJoinedCommunities from "../helperComponent/ShowJoinedCommunities";
import YourCommunities from "../helperComponent/YourCommunities";
import UserPages from "../helperComponent/UserPages";
import SearchCommunity from "../helperComponent/SearchCommunity";
import SearchUser from "../helperComponent/SearchUser";
import ShowAllCommunities from "../helperComponent/ShowAllCommunities";
import CreateCommunity from "../helperComponent/CreateCommunity";
import CreatePost from "../helperComponent/CreatePost";
import CreatePage from "../helperComponent/CreatePage";
import SearchedPage from "../helperComponent/SearchedPage";
import { useActiveSectionContext } from "../context/ActiveSectionContext";


import { FaSearch, FaGlobe} from "react-icons/fa";
import { Group as GroupIcon, Public as PublicIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';

import { IoIosGlobe } from "react-icons/io";

import "../CSS/loggedinUser.css";

const LoggedinUser = () => {
  const {activeSection, setActiveSection} = useActiveSectionContext();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [showSearch, setShowSearch] = useState(null);

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleSearchIconClick = () => {
    setShowSearch(prv => !prv);
    if (searchType === "user") {
      handleSectionToggle("searchUser");
    } else if (searchType === "community") {
      handleSectionToggle("searchCommunity");
    } else if (searchType === "page") {
      handleSectionToggle("searchPage");
    } else {
      handleSectionToggle("")
    }
  }

  const handleClearActiveSection = () => {
    handleSectionToggle("");
  }

  const handleShowSearch = () => {
    setShowSearch(prv => !prv);
  }

  return (
    <div className="loggedin-user">
      {!activeSection ? (
        <div className="loggedin-user-choices">
          {!showSearch && <button onClick={handleShowSearch} className="search-icon"><FaSearch /></button> }
          {showSearch && (  
            <div className="search">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Enter a name"
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
              <button onClick={handleSearchIconClick} className="search-icon"><FaSearch /></button>
              </div>
            </div>
          )}

          <button onClick={() => handleSectionToggle("communities")}><GroupIcon /> Joined Communities</button>

          <button onClick={() => handleSectionToggle("showAllCommunities")}><PublicIcon /> Show All Communities</button>

          <button onClick={() => handleSectionToggle("YourCommunities")}><FaGlobe /> Your Communities</button>

          <button onClick={() => handleSectionToggle("Pages")}><AccountCircleIcon /> Your Pages</button>

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
          {activeSection === "YourCommunities" && (
            <YourCommunities />
          )}
          {activeSection === "Pages" && (
            <UserPages />
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
