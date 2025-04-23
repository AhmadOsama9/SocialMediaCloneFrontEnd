import { useState, useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { useCommunityRelationContext } from "../context/CommunityRelationContext";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "./OtherUserProfile";
import CreateCommunityPost from "../helperComponent/CreateCommunityPost";
import CommunityPosts from "../helperComponent/CommunityPosts";
import { useCreateCommunityPostContext } from "../context/createCommunityPostContext";
import Loader from "../helperComponent/Loader";

import "../CSS/communityProfile.css";

const CommunityProfile = ({ community }) => {
    const communityId = community._id ? community._id : community.id;
    const { error, isLoading, sendJoinRequest, cancelJoinRequest, leaveCommunity, removeMember, getCommunityRelation, acceptJoinRequest, declineJoinRequest, deleteCommunity, getMembers, getMembershipRequests } = useCommunity();
    const { relation, membershipRequests, members } = useCommunityRelationContext();
    const { searchUserAndReturn } = useSearchUser();

    const [showMembers, setShowMembers] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);
    const [otherRelation, setOtherRelation] = useState("");
    const { createPost, setCreatePost } = useCreateCommunityPostContext();
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
      getCommunityRelation(communityId);
      getMembers(communityId);
      getMembershipRequests(communityId);
    }, []);

    const handleSendJoinRequest = () => {
      sendJoinRequest(communityId);
    }

    const handleCancelRequest = () => {
      cancelJoinRequest(communityId);
    }

    const handleLeaveCommunity = () => {
      leaveCommunity(communityId);
    }

    const handleShowProfileCallback = (nickname, relation) => {
      handleShowProfile(nickname, relation);
    };

    const handleShowProfile = async (nickname, relation) => {
      const returnedUser = await searchUserAndReturn(nickname);
      setUser(returnedUser);
      setOtherRelation(relation);
      setShowProfile(true);
    }

    const handleBackToCommunity = () => {
      setUser(null);
      setOtherRelation("");
      setShowProfile(false);
    }

    const handleToggleCreatePost = () => {
      setCreatePost(prev => !prev);
    }

    const handleDeleteCommunity = () => {
      if (confirmDelete) {
        deleteCommunity(communityId);
      } else {
        setConfirmDelete(true);
      }
    }

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
      <div className="community-container">
        {showProfile ? (
          <div className="user-profile-view">
            <button onClick={handleBackToCommunity} className="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Community
            </button>
            <OtherUserProfile otherUser={user} relation={otherRelation} />
          </div>
        ) : (
          <div className="community-profile">
            <div className="community-header">
              <h1 className="community-name">{community.name}</h1>
              <p className="community-description">{community.description}</p>
              
              <div className="community-stats">
                <div className="community-stat">
                  <div className="stat-value">{members?.length || 0}</div>
                  <div className="stat-label">Members</div>
                </div>
                {relation === "admin" && (
                  <div className="community-stat">
                    <div className="stat-value">{membershipRequests?.length || 0}</div>
                    <div className="stat-label">Pending Requests</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="community-actions">
              {relation === "None" && (
                <button onClick={handleSendJoinRequest} className="action-button primary-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Send Join Request
                </button>
              )}
              
              {relation === "Pending" && (
                <div className="pending-request">
                  <p className="request-status">Your request is pending approval</p>
                  <button onClick={handleCancelRequest} className="action-button secondary-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Cancel Request
                  </button>
                </div>
              )}
              
              {(relation === "member" || relation === "admin") && (
                <div className="member-actions">
                  <button onClick={handleToggleCreatePost} className="action-button primary-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    {createPost ? "Cancel Post" : "Create Post"}
                  </button>
                  
                  <button onClick={() => setShowMembers(prev => !prev)} className="action-button secondary-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {showMembers ? "Hide Members" : "Show Members"}
                  </button>
                  
                  <button onClick={handleLeaveCommunity} className="action-button danger-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Leave Community
                  </button>
                </div>
              )}
              
              {relation === "admin" && (
                <div className="admin-actions">
                  <button onClick={() => setShowRequests(prev => !prev)} className="action-button secondary-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    {showRequests ? "Hide Requests" : "Show Requests"}
                  </button>
                  
                  <button onClick={handleDeleteCommunity} className="action-button danger-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    {confirmDelete ? "Confirm Delete" : "Delete Community"}
                  </button>
                </div>
              )}
            </div>
            
            {showMembers && (
              <div className="community-section members-section">
                <h2 className="section-title">Community Members</h2>
                {members.length === 0 ? (
                  <p className="empty-message">No members in this community</p>
                ) : (
                  <div className="member-list">
                    {members.map((member) => (
                      <div key={member.userId} className="member-card">
                        <div className="member-info">
                          <h3 className="member-name">{member.nickname}</h3>
                          <span className={`member-status status-${member.relation}`}>{member.relation}</span>
                        </div>
                        <div className="member-actions">
                          <button 
                            onClick={() => handleShowProfileCallback(member.nickname, member.relation)} 
                            className="member-button view-button"
                          >
                            View Profile
                          </button>
                          {relation === "admin" && member.relation !== "admin" && (
                            <button 
                              onClick={() => removeMember(member.userId, communityId)} 
                              className="member-button remove-button"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {showRequests && relation === "admin" && (
              <div className="community-section requests-section">
                <h2 className="section-title">Membership Requests</h2>
                {membershipRequests.length === 0 ? (
                  <p className="empty-message">No pending requests</p>
                ) : (
                  <div className="request-list">
                    {membershipRequests.map((request) => (
                      <div key={request.userId} className="request-card">
                        <div className="request-info">
                          <h3 className="request-name">{request.nickname}</h3>
                          <button 
                            onClick={() => handleShowProfileCallback(request.nickname, request.relation)} 
                            className="view-profile-link"
                          >
                            View Profile
                          </button>
                        </div>
                        <div className="request-actions">
                          <button 
                            onClick={() => acceptJoinRequest(request.userId, communityId)} 
                            className="request-button accept-button"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => declineJoinRequest(request.userId, communityId)} 
                            className="request-button decline-button"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {createPost && (
              <div className="create-post-section">
                <CreateCommunityPost communityId={communityId} />
              </div>
            )}
            
            <div className="community-posts-section">
              <h2 className="section-title">Community Posts</h2>
              <CommunityPosts communityId={communityId} />
            </div>
          </div>
        )}
      </div>
    );   
}

export default CommunityProfile;