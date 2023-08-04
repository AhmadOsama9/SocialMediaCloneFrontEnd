import { createContext, useContext, useState } from "react";

const CommunityRelationContext = createContext();

export const useCommunityRelationContext = () => {
    const context = useContext(CommunityRelationContext);
    if (!context) {
        throw Error("Cannot use CommunityRelationContext outside the provider");
    }

    return context;
}

export const CommunityRelationProvider = ({ children }) => {
    const [relation, setRelation] = useState("None");
    const [membershipRequests, setMembershipRequests] = useState([]);
    const [members, setMembers] = useState([]);

    return (
        <CommunityRelationContext.Provider value={{ relation, setRelation, membershipRequests, setMembershipRequests, members, setMembers }}>
            {children}
        </CommunityRelationContext.Provider>
    );
}