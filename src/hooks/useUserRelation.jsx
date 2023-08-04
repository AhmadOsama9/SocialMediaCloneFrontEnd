// Example component to handle friend relationships
const FriendRelationship = ({ loggedInUserId, searchedUserId }) => {
    const [relationshipStatus, setRelationshipStatus] = useState("None");
  
    useEffect(() => {
      // Fetch the relationship status when the component mounts
      getFriendRelationshipStatus(loggedInUserId, searchedUserId);
    }, [loggedInUserId, searchedUserId]);
  
    const getFriendRelationshipStatus = async (userId, otherUserId) => {
      try {
        const response = await fetch("/api/getFriendRelationshipStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, otherUserId }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setRelationshipStatus(data.status);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error getting friend relationship status:", error);
      }
    };
  
    const handleSendFriendRequest = async () => {
      try {
        const response = await fetch("/api/sendFriendRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderId: loggedInUserId, receiverId: searchedUserId }),
        });
  
        if (response.ok) {
          // Friend request sent successfully
          setRelationshipStatus("Pending");
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    };
  
    const handleAcceptFriendRequest = async () => {
      try {
        const response = await fetch("/api/acceptFriendRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, friendId: searchedUserId }),
        });
  
        if (response.ok) {
          // Friend request accepted successfully
          setRelationshipStatus("Friends");
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    };
  
    const handleRemoveFriend = async () => {
      try {
        const response = await fetch("/api/removeFriend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId, friendId: searchedUserId }),
        });
  
        if (response.ok) {
          // Friend removed successfully
          setRelationshipStatus("None");
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    };
  
    return (
      <div>
        {relationshipStatus === "None" && (
          <button onClick={handleSendFriendRequest}>Send Friend Request</button>
        )}
        {relationshipStatus === "Pending" && <p>Waiting for the user to accept your friend request</p>}
        {relationshipStatus === "Received" && (
          <>
            <button onClick={handleAcceptFriendRequest}>Accept Friend Request</button>
            <button onClick={handleRemoveFriend}>Decline Friend Request</button>
          </>
        )}
        {relationshipStatus === "Friends" && <button onClick={handleRemoveFriend}>Remove Friend</button>}
      </div>
    );
  };
  
  export default FriendRelationship;
  