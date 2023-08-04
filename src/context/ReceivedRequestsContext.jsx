import { createContext, useContext, useState } from "react";

const ReceivedRequestsContext = createContext();

export const useReceivedRequestsContext = () => {
    const context = useContext(ReceivedRequestsContext);

    if (!context) {
        throw Error("Cannot use RelationContext outside of the RelationContext Provider");
    }

    return context;
}

export const ReceivedRequestsProvider = ({ children }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [relationshipStatus, setRelationshipStatus] = useState("None");


  return (
    <ReceivedRequestsContext.Provider value={{ pendingRequests, setPendingRequests, relationshipStatus, setRelationshipStatus }}>
        {children}
    </ReceivedRequestsContext.Provider>
  );
    
}