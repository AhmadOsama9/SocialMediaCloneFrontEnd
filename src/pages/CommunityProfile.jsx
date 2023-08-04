import { useState, useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { useCommunityRelationContext } from "../context/communityRelation";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "./OtherUserProfile";


const CommunityProfile = ({ community }) => {
    const communityId = community._id ? community._id : community.id;
    const { error, isLoading, sendJoinRequest, cancelJoinRequest, leaveCommunity, removeMember, getCommunityRelation, acceptJoinRequest, declineJoinRequest, deleteCommunity, getMembers, getMembershipRequests } = useCommunity();
    const { relation, membershipRequests, members } = useCommunityRelationContext();
    const { searchUserAndReturn } = useSearchUser();

    const [showMembers, setShowMembers] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);

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

    const handleShowProfileCallback = (nickname) => {
      handleShowProfile(nickname);
    };

    const handleShowProfile = async (nickname) => {
      const returnedUser = await searchUserAndReturn(nickname)
      setUser(returnedUser);
      setShowProfile(prv => !prv);

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
                    {/*Here I can make a component to show the members and the posts */}
                    <button onClick={() => setShowMembers(prv => !prv)}>Show Members</button>
                    {showMembers &&
                      members.map((member) => (
                        <div key={member.userId} className="members">
                          <span>Name: {member.nickname}</span>
                          <span>State: {member.relation}</span>
                          <button onClick={() => handleShowProfileCallback(request.nickname)}>Show Profile</button>
                          {showProfile && <OtherUserProfile otherUser={user} relation="None"/>}
                        </div>
                      ))
                    }
                  </div>
                }
                {relation === "admin" && 
                   <div>
                    <button onClick={handleLeaveCommunity}>Leave Community</button>
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
                          <button onClick={() => handleShowProfileCallback(request.nickname)}>Show Profile</button>
                          <button onClick={() => removeMember(member.userId, communityId)}>Remove from community</button>
                          {showProfile && <OtherUserProfile otherUser={user} relation="None"/>}
                        </div>
                      ))
                    }
                    {showRequests &&
                      membershipRequests.map((request) => (
                        <div key={request.userId} className="members">
                          <span>Nickname: {request.nickname}</span>
                          <button onClick={() => handleShowProfileCallback(request.nickname)}>Show Profile</button>
                          <button onClick={() => declineJoinRequest(request.userId, communityId)}>Decline</button>
                          <button onClick={() => acceptJoinRequest(request.userId, communityId)}>Accept</button>
                          {showProfile && <OtherUserProfile otherUser={user} relation="None"/>}
                        </div>
                      ))
                    }
                  </div>
                }
            </div>
        </div>
    );   

}

export default CommunityProfile;