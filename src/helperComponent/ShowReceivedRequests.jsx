import { useState } from "react";
import { useRequest } from "../hooks/useRequest";

import OtherUserProfile from "../pages/OtherUserProfile";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";
import Loader from "../helperComponent/Loader";



const ShowReceivedRequests = () => {
  const { isLoading, error, acceptRequest, declineRequest } = useRequest();
  const [showProfile, setShowProfile] = useState(false);

  const { pendingRequests } = useReceivedRequestsContext();


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3>Error: {error}</h3>;
  }

  if (pendingRequests.length === 0) {
    return <h3>You have no pending requests</h3>
  }

  return (
    <div>
        <h3>ShowPendingRequests</h3>
        {pendingRequests.map((request) => (
            <div key={request.user}>
                <span>Nickname: {request.nickname} </span>
                <button onClick={() => acceptRequest(request.user)}>Accept</button>
                <button onClick={() => declineRequest(request.user)}>Decline</button>
                <button onClick={() => setShowProfile(prv => !prv)}>Show Profile</button>
                {showProfile && <OtherUserProfile otherUser={request} />}
                
            </div>
        ))}
    </div>
  )
}

export default ShowReceivedRequests;