import { useState, useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { useCommunityRelationContext } from "../context/communityRelation";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "./OtherUserProfile";
import CreateCommunityPost from "../helperComponent/CreateCommunityPost";
import CommunityPosts from "../helperComponent/CommunityPosts";
import { useCreateCommunityPostContext } from "../context/createCommunityPostContext";


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
        return <h3>Loading</h3>
    }

    if (error) {
        return <h3>Error: {error}</h3>
    }

    return (
      <div>
        {showProfile && (
          <div>
            <button onClick={handleBackToCommunity}>Back to Community</button>
            <OtherUserProfile otherUser={user} relation={otherRelation} />
          </div>
        )}
        {!showProfile && (
          <div className="community-profile">
              <div className="community-info">
                  <span>Name: {community.name}</span>
                  <span>Description: {community.description}</span>
                  {relation === "None" && (
                      <button onClick={handleSendJoinRequest}>Send Join Request</button>
                  )}
                  {relation === "Pending" && 
                    <div>
                      <p>waiting for the admin to accept your request</p>
                      <button onClick={handleCancelRequest}>Cancel Request</button>
                    </div>
                  }
                  {relation === "member" && 
                    <div>
                      <button onClick={handleLeaveCommunity}>Leave Community</button>
                      <button onClick={handleToggleCreatePost}>Create Post</button>
                      {/*Here I can make a component to show the members and the posts */}
                      <button onClick={() => setShowMembers(prv => !prv)}>Show Members</button>
                      {showMembers && 
                        members.map((member) => (
                          <div key={member.userId} className="members">
                            <span>Name: {member.nickname}</span>
                            <span>State: {member.relation}</span>
                            <button onClick={() => handleShowProfileCallback(member.nickname, member.relation)}>Show Profile</button>
                          </div>
                        ))
                      }
                    </div>
                  }
                  {relation === "admin" && 
                    <div>
                      <button onClick={handleLeaveCommunity}>Leave Community</button>
                      <button onClick={handleToggleCreatePost}>Create Post</button>
                      {/*Here I can make a component to show the members and the posts
                        but with stuff only related to the admin */}
                      <button onClick={() => setShowMembers(prv => !prv)}>Show Members</button>
                      <button onClick={() => setShowRequests(prv => !prv)}>Show Requests</button>
                      <button onClick={handleDeleteCommunity}>Delete Community</button>
                      {showMembers &&
                        members.map((member) => (
                          <div key={member.userId} className="members">
                            <span>Name: {member.nickname}</span>
                            <span>State: {member.relation}</span>
                            <button onClick={() => handleShowProfileCallback(member.nickname, member.relation)}>Show Profile</button>
                            <button onClick={() => removeMember(member.userId, communityId)}>Remove from community</button>
                          </div>
                        ))
                      }
                      {showRequests &&
                        membershipRequests.map((request) => (
                          <div key={request.userId} className="members">
                            <span>Nickname: {request.nickname}</span>
                            <button onClick={() => handleShowProfileCallback(request.nickname, request.relation)}>Show Profile</button>
                            <button onClick={() => declineJoinRequest(request.userId, communityId)}>Decline</button>
                            <button onClick={() => acceptJoinRequest(request.userId, communityId)}>Accept</button>
                          </div>
                        ))
                      }
                    </div>
                  }
              </div>
              {createPost && (
                <CreateCommunityPost communityId={communityId} />
              )}
              <div>
                <h3>Posts</h3>
                <CommunityPosts communityId={communityId} />
              </div>
          </div>
        )}
      </div>
    );   

}

export default CommunityProfile;