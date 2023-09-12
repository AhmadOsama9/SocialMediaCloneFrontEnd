import { useState, useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { useCommunityRelationContext } from "../context/CommunityRelationContext";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "./OtherUserProfile";
import CreateCommunityPost from "../helperComponent/CreateCommunityPost";
import CommunityPosts from "../helperComponent/CommunityPosts";
import { useCreateCommunityPostContext } from "../context/CreateCommunityPostContext";
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
    const {createPost, setCreatePost} = useCreateCommunityPostContext();

    useEffect(() => {
      getCommunityRelation(communityId);
      getMembers(communityId);
      getMembershipRequests(communityId);
    }, [])

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
      const returnedUser = await searchUserAndReturn(nickname)
      setUser(returnedUser);
      setOtherRelation(relation);
      setShowProfile(prv => !prv);

    }

    const handleBackToCommunity = () => {
      setUser(null);
      setOtherRelation(null);
      setShowProfile(prv => !prv);
    }

    const handleToggleCreatePost = () => {
      setCreatePost(prv => !prv)
    }

    const handleDeleteCommunity = () => {
      //here I should double check that he's sure he wants to delete the community
    }

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <h3>Error: {error}</h3>
    }

    return (
      <div>
        {showProfile && (
          <div>
            <button onClick={handleBackToCommunity} className="back-button">Back to Community</button>
            <OtherUserProfile otherUser={user} relation={otherRelation} />
          </div>
        )}
        {!showProfile && (
          <div className="community-profile">
            <div className="community-info">
              <div className="basic-info">
                <span className="community-name"><span className="span">Name: </span> {community.name}</span>
                <span className="community-description"><span className="span">Description: </span> {community.description}</span>
              </div>
              {relation === "None" && (
                <button onClick={handleSendJoinRequest} className="join-button">Send Join Request</button>
              )}
              {relation === "Pending" && 
                <div>
                  <p className="request-status">Waiting for the admin to accept your request</p>
                  <button onClick={handleCancelRequest} className="cancel-button">Cancel Request</button>
                </div>
              }
              {relation === "member" && 
                <div>
                  <button onClick={handleLeaveCommunity} className="leave-button">Leave Community</button>
                  <button onClick={handleToggleCreatePost} className="create-post-button">Create Post</button>
                  <button onClick={() => setShowMembers(prev => !prev)} className="show-members-button">Show Members</button>
                  {showMembers && 
                    members.map((member) => (
                      <div key={member.userId} className="members">
                        <span>Name: {member.nickname}</span>
                        <span>State: {member.relation}</span>
                        <button onClick={() => handleShowProfileCallback(member.nickname, member.relation)} className="show-profile-button">Show Profile</button>
                      </div>
                    ))
                  }
                </div>
              }
              {relation === "admin" && 
                <div>
                  <button onClick={handleLeaveCommunity} className="leave-button">Leave Community</button>
                  <button onClick={handleToggleCreatePost} className="create-community-post-button">Create Post</button>
                  <button onClick={() => setShowMembers(prev => !prev)} className="show-members-button">Show Members</button>
                  <button onClick={() => setShowRequests(prev => !prev)} className="show-requests-button">Show Requests</button>
                  <button onClick={handleDeleteCommunity} className="delete-community-button">Delete Community</button>
                  {showMembers &&
                    members.map((member) => (
                      <div key={member.userId} className="members">
                        <span>Name: {member.nickname}</span>
                        <span>State: {member.relation}</span>
                        <button onClick={() => handleShowProfileCallback(member.nickname, member.relation)} className="show-profile-button">Show Profile</button>
                        <button onClick={() => removeMember(member.userId, communityId)} className="remove-member-button">Remove from community</button>
                      </div>
                    ))
                  }
                  {showRequests &&
                    membershipRequests.map((request) => (
                      <div key={request.userId} className="members">
                        <span>Nickname: {request.nickname}</span>
                        <button onClick={() => handleShowProfileCallback(request.nickname, request.relation)} className="show-profile-button">Show Profile</button>
                        <button onClick={() => declineJoinRequest(request.userId, communityId)} className="decline-button">Decline</button>
                        <button onClick={() => acceptJoinRequest(request.userId, communityId)} className="accept-button">Accept</button>
                      </div>
                    ))
                  }
                </div>
              }
            </div>
            {createPost && (
              <CreateCommunityPost communityId={communityId} />
            )}
            <div className="community-posts">
              <h3>Posts</h3>
              <CommunityPosts communityId={communityId} />
            </div>
          </div>
        )}
      </div>

    );   

}

export default CommunityProfile;