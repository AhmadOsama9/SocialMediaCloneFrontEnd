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

// Using Lucide icons
import { 
  Search, 
  Users, 
  Globe, 
  UserCircle,
  PlusCircle,
  FileEdit,
  FileSpreadsheet,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";

import "../CSS/loggedinUser.css";

const LoggedinUser = () => {
  const {activeSection, setActiveSection} = useActiveSectionContext();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [showSearch, setShowSearch] = useState(false);

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleSearchSubmit = (e) => {
    e && e.preventDefault();
    
    if (searchText.trim() === "") return;
    
    if (searchType === "user") {
      handleSectionToggle("searchUser");
    } else if (searchType === "community") {
      handleSectionToggle("searchCommunity");
    } else if (searchType === "page") {
      handleSectionToggle("searchPage");
    }
  };

  const handleClearActiveSection = () => {
    setActiveSection("");
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    if (showSearch) {
      setSearchText("");
    }
  };

  return (
    <div className="loggedin-user">
      {!activeSection ? (
        <>
          {/* Professional Search Bar at Top */}
          <div className={`search-container ${showSearch ? 'active' : ''}`}>
            <div className="search-header">
              <h3>
                <Search size={18} strokeWidth={2} /> 
                Find what you're looking for
              </h3>
              <button className="search-toggle-btn" onClick={toggleSearch}>
                {showSearch ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            <form 
              className={`search-form ${showSearch ? 'visible' : ''}`}
              onSubmit={handleSearchSubmit}
            >
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Enter search term..."
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
              </div>
              <button type="submit" className="search-button">
                <Search size={16} strokeWidth={2} />
                Search
              </button>
            </form>
          </div>
          
          {/* Dashboard Options */}
          <div className="loggedin-user-choices">
            <button onClick={() => handleSectionToggle("communities")}>
              <Users size={20} strokeWidth={2} className="icon" /> Joined Communities
            </button>

            <button onClick={() => handleSectionToggle("showAllCommunities")}>
              <Globe size={20} strokeWidth={2} className="icon" /> Show All Communities
            </button>

            <button onClick={() => handleSectionToggle("YourCommunities")}>
              <Users size={20} strokeWidth={2} className="icon" /> Your Communities
            </button>

            <button onClick={() => handleSectionToggle("Pages")}>
              <UserCircle size={20} strokeWidth={2} className="icon" /> Your Pages
            </button>

            <button onClick={() => handleSectionToggle("createCommunity")}>
              <PlusCircle size={20} strokeWidth={2} className="icon" /> Create Community
            </button>
            
            <button onClick={() => handleSectionToggle("createPost")}>
              <FileEdit size={20} strokeWidth={2} className="icon" /> Create Post
            </button>

            <button onClick={() => handleSectionToggle("createPage")}>
              <FileSpreadsheet size={20} strokeWidth={2} className="icon" /> Create Page
            </button>
          </div>
        </>
      ) : (
        <div className="active-section-wrapper">
          <button onClick={handleClearActiveSection} className="close-btn">
            <ChevronLeft size={18} />
            Back to Dashboard
          </button>

          {activeSection === "communities" && <ShowJoinedCommunities />}
          {activeSection === "searchUser" && <SearchUser nickname={searchText} />}
          {activeSection === "searchCommunity" && <SearchCommunity name={searchText} />}
          {activeSection === "searchPage" && <SearchedPage name={searchText} />}
          {activeSection === "showAllCommunities" && <ShowAllCommunities />}
          {activeSection === "YourCommunities" && <YourCommunities />}
          {activeSection === "Pages" && <UserPages />}
          {activeSection === "createCommunity" && <CreateCommunity />}
          {activeSection === "createPost" && <CreatePost />}
          {activeSection === "createPage" && <CreatePage />}
        </div>
      )}
    </div>
  );
};

export default LoggedinUser;