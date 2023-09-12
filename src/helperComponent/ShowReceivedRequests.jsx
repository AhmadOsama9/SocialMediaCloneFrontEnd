import { useState } from "react";
import { useRequest } from "../hooks/useRequest";

import OtherUserProfile from "../pages/OtherUserProfile";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";
import Loader from "../helperComponent/Loader";

import "../CSS/ShowReceivedRequests.css";

const ShowReceivedRequests = () => {
  const { isLoading, error, acceptRequest, declineRequest } = useRequest();
  const [showProfile, setShowProfile] = useState(false);

  const { pendingRequests } = useReceivedRequestsContext();


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3 className=".error">Error: {error}</h3>;
  }

  if (pendingRequests.length === 0) {
    return <h3>You have no pending requests</h3>
  }

  return (
    <div className="show-pending-requests">
    <h3 className="section-title">Show Pending Requests</h3>
    {pendingRequests.map((request) => (
      <div key={request.user} className="request-item">
        <span className="user-nickname">Nickname: {request.nickname}</span>
        <button onClick={() => acceptRequest(request.user)} className="accept-button">Accept</button>
        <button onClick={() => declineRequest(request.user)} className="decline-button">Decline</button>
        <button onClick={() => setShowProfile(prv => !prv)} className="show-profile-button">Show Profile</button>
        {showProfile && <OtherUserProfile otherUser={request} />}
      </div>
    ))}
  </div>

  )
}

export default ShowReceivedRequests;