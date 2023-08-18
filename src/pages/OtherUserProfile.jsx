import { useState, useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import { useChat } from "../hooks/useChat";
import OtherUserPosts from "../helperComponent/OtherUserPosts";
import OtherUserSharedPosts from "../helperComponent/OtherUserSharedPosts";

import "../CSS/OtherUserProfile.css";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";


const OtherUserProfile = ({ otherUser, relation }) => {
  const { isLoading, error, acceptRequest, declineRequest, setIsLoading, setError } = useRequest();

  const { relationshipStatus, setRelationshipStatus } = useReceivedRequestsContext();
  const [showChat, setShowChat] = useState(false);

  const { messages, sendMessage, getChatMessages } = useChat();

  const [newMessage, setNewMessage] = useState("");

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  const otherUserId = otherUser.user;

  
  const [activePostsType, setActivePostsType] = useState("");

  const handlePostsTypeToggle = (section) => {
    setActivePostsType(prvType => (prvType === section ? "" : section));
  }

  useEffect(() => {
    getFriendRelationshipStatus(userId, otherUserId);
  }, [userId, otherUserId]);

  const getFriendRelationshipStatus = async (userId, otherUserId) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getrelation?userId=${userId}&otherUserId=${otherUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRelationshipStatus(data.relation);
      } else {
        setError(data.error);
      }

      setIsLoading(false);
  };
  
  const handleSendFriendRequest = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/sendrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otherUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        setRelationshipStatus("Pending");
      } else {
        setError(data.error);
      }

      setIsLoading(false);

  };

  const handleRemoveFriend = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otherUserId }),
      });

      const data = response.json();

      if (response.ok) {
        setRelationshipStatus("None");
      } else {
        setError(data.error);
      }
      setIsLoading(false);

  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/cancelrequest", {
      method: "Post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId, otherUserId}),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error);
    } else {
      setRelationshipStatus("None");
    }
  }

  const handleShowChat = () => {
    setShowChat(prv => !prv);
    getChatMessages(otherUserId);
  }

  const handleCloseChat = () => {
    setShowChat(prv => !prv);
  }

  const handleSendMessage = () => {
    sendMessage(otherUserId, newMessage);
    setNewMessage("");
  }; 
  
  if (isLoading) {
    return <h3>Loading</h3>;
  }

  if(error) {
    return <h3>Error: {error}</h3>;
  }

  return (
    <div className="other-user-profile">
      {!showChat &&(
        <div>
          <div className="user-info">
            <span>Nickname: {otherUser.nickname}</span>
            <span>Age: {otherUser.age}</span>
            <span>gender: {otherUser.gender}</span>
            <span>Bio: {otherUser.bio}</span>
            {relationshipStatus === "None" && (
            <button onClick={handleSendFriendRequest}>Send Friend Request</button>
            )}
            {relationshipStatus === "Pending" && 
            <div>
              <p>Waiting for the user to accept your friend request</p>
              <button onClick={handleCancelRequest}>Cancel Request</button>
            </div>}
            {relationshipStatus === "Received" && (
            <div className="received">
                <button onClick={() => acceptRequest(otherUserId)}>Accept Friend Request</button>
                <button onClick={() => declineRequest(otherUserId)}>Decline Friend Request</button>
            </div>
            )}
            {relationshipStatus === "Friends" && <button onClick={handleRemoveFriend}>Remove Friend</button>}
            <button onClick={handleShowChat}>Send Message</button>
          </div>
        </div>
      )}
      {showChat && (
        <>
          <button onClick={handleCloseChat}>X</button>
          <div className="chat-container">
              {messages.map((msg, index) => (
              <div
                  key={index}
                  className={`chat-message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}
              >
                  <p>{msg.content}</p>
              </div>
              ))}
          </div>
          <div className="message-input">
              <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
      <div>
        <button onClick={() => handlePostsTypeToggle("UserPosts")}>Posts</button>
        <button onClick={() => handlePostsTypeToggle("SharedPosts")}>SharedPosts</button>
      </div>
      <div>
        {activePostsType === "UserPosts" && (
          <OtherUserPosts />
        )}
        {activePostsType === "SharedPosts" && (
          <OtherUserSharedPosts />
        )}
      </div>
  </div>
  );
};
  
export default OtherUserProfile;
  