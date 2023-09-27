import { useState, useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import { useChat } from "../hooks/useChat";
import OtherUserProfilePosts from "../helperComponent/otherUserProfilePosts";
import OtherUserSharedPosts from "../helperComponent/OtherUserSharedPosts";
import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4 } from "../assets/avatar";


import "../CSS/otheruserprofile.css";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";


const OtherUserProfile = ({ otherUser, relation }) => {
  const { isLoading, error, acceptRequest, declineRequest, setIsLoading, setError } = useRequest();

  const { relationshipStatus, setRelationshipStatus } = useReceivedRequestsContext();
  const [showChat, setShowChat] = useState(false);

  const { messages, chatId, sendMessageByChatId, getChatMessages, chatError } = useChat();

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

      const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getrelation?userId=${userId}&otherUserId=${otherUserId}`, {
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

      const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/sendrequest", {
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

      const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/remove", {
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

    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/cancelrequest", {
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
    sendMessageByChatId(chatId, newMessage);
    setNewMessage("");
  }; 
  
  if (isLoading) {
    return <Loader />;
  }

  if(error) {
    return <h3 className="error">Error: {error}</h3>;
  }

  if (chatError) {
    return <h3 className="error">Error: {chatError}</h3>
  }

  return (
    <div className="other-user-profile">
      {!showChat &&(
        <div>
          <div className="user-info">
            <span  className="selected-avatar">
              <img
                src={
                  otherUser.image === "1"
                    ? avatar1
                    : otherUser.image === "2"
                    ? avatar2
                    : otherUser.image === "3"
                    ? avatar3
                    : otherUser.image === "4"
                    ? avatar4
                    : null
                }
                alt={`Avatar}`}
                className="selected-avatar-image"
              />
            </span>
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
        <div className="chat">
          <button className="close-button" onClick={handleCloseChat}>X</button>
          <div className="chat-container">
              {messages.map((msg, index) => (
              <div
                  key={index}
                  className={`chat-message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}
              >
                  <p>{msg.content}</p>
                  {msg.createdAt && <span>{msg.createdAt}</span>}
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
        </div>
      )}
      {!showChat && (
        <div>
          <button className="switch-button" onClick={() => handlePostsTypeToggle("UserPosts")}>Posts</button>
          <button className="switch-button" onClick={() => handlePostsTypeToggle("SharedPosts")}>SharedPosts</button>
        </div>
      )}
      <div>
        {activePostsType === "UserPosts" && (
          <OtherUserProfilePosts otherUser={otherUser}/>
        )}
        {activePostsType === "SharedPosts" && (
          <OtherUserSharedPosts otherUser={otherUser}/>
        )}
      </div>
  </div>
  );
};
  
export default OtherUserProfile;
  