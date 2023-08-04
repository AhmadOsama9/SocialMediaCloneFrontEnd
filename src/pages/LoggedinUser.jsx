import { useState } from "react";
import Friends from "../helperComponent/friends";
import ShowJoinedCommunities from "../helperComponent/ShowJoinedCommunities";
import SearchCommunity from "../helperComponent/SearchCommunity";
import SearchUser from "../helperComponent/SearchUser";
import ShowAllCommunities from "../helperComponent/ShowAllCommunities";
import CreateCommunity from "../helperComponent/CreateCommunity";

import "../CSS/loggedinUser.css";

const LoggedinUser = () => {
  const [activeSection, setActiveSection] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchCommunity, setSearchCommunity] = useState("");

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? "" : section));
  };

  const handleClearActiveSection = () => {
    setActiveSection("");
    setSearchUser("");
    setSearchCommunity("");
  }

  return (
    <div className="loggedin-user">
      {!activeSection ? (
        <div className="loggedin-user-choices">
          <button onClick={() => handleSectionToggle("communities")}>Joined Communities</button>
          <div className="search">
            <input
              type="text"
              placeholder="Search for a user by nickname"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button onClick={() => handleSectionToggle("searchUser")}>Search User</button>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search for a community by name"
              value={searchCommunity}
              onChange={(e) => setSearchCommunity(e.target.value)}
            />
            <button onClick={() => handleSectionToggle("searchCommunity")}>Search Community</button>
          </div>
          <button onClick={() => handleSectionToggle("showAllCommunities")}>Show All Communities</button>

          <button onClick={() => handleSectionToggle("createCommunity")}>Create Community</button>
        </div>
      ) : (
        <div className="active-section-wrapper">
          {/* Button to close active section */}
          <button onClick={handleClearActiveSection} className="close-btn">Close Section</button>

          {activeSection === "communities" && (
            <ShowJoinedCommunities />
          )}
          {activeSection === "searchUser" && (
            <SearchUser nickname={searchUser} />
          )}
          {activeSection === "searchCommunity" && (
            <SearchCommunity name={searchCommunity} />
          )}
          {activeSection === "showAllCommunities" && (
            <ShowAllCommunities />
          )}
          {activeSection === "createCommunity" && (
            <CreateCommunity />
          )}
        </div>
      )}
    </div>
  );
};

export default LoggedinUser;
