import { useState } from "react";
import { useCommunityRelationContext } from "../context/communityRelation";


export const useCommunity = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const userString = localStorage.getItem("user");
    const currentUserId = JSON.parse(userString).userId;

    const { relation, setRelation, membershipRequests, setMembershipRequests, members, setMembers } = useCommunityRelationContext();


    const getCommunityRelation = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/relation?userId=${currentUserId}&communityId=${communityId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
        const json = await response.json();

        if (response.ok) {
        setRelation(json.relation);
        } else {
        setError(json.error);
        }

        setIsLoading(false);
    };

    const sendJoinRequest = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/sendrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: currentUserId, communityId}),
        });

        const json = await response.json();

        if (response.ok) {
            setRelation("Pending");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const cancelJoinRequest = async (communityId) => {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/cancelrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: currentUserId, communityId }),
        });

        const json = await response.json();

        if (response.ok) {
            setRelation("None");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const acceptJoinRequest = async (userId, communityId) => {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/acceptrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, communityId }),
        })

        const json = await response.json();

        if (response.ok) {
            getMembershipRequests();
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const declineJoinRequest = async (userId, communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/declinerequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, communityId }),
        })

        const json = await response.json();

        if (response.ok) {
            getMembershipRequests();
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const getMembers = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/getmembers?communityId=${communityId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();

        if (response.ok) {
            setMembers(json);
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const removeMember = async (userId, communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/removemember", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId, communityId }),
        });

        const json = await response.json();

        if (response.ok) {
            alert("The user has been removed Succesfully");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const deleteCommunity = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/delete", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: currentUserId, communityId }),
        });

        const json = await response.json();

        if (response.ok) {
            alert("The community has been deleted Successfully");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const getMembershipRequests = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/getmembershiprequests?communityId=${communityId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        const json = await response.json();
        
        if (response.ok) {
            setMembershipRequests(json);
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const leaveCommunity = async (communityId) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/leave?userId=${currentUserId}&communityId=${communityId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();

        if (response.ok) {
            alert("You have left the community Successfully");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    const createCommunity = async (name, description) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/community/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, description, userId: currentUserId })
        });

        const json = await response.json();

        if (response.ok) {
            alert("The community has been created Successfully");
        } else {
            setError(json.error);
        }
        setIsLoading(false);
    }

    return { error, isLoading, relation, members, membershipRequests, getCommunityRelation, sendJoinRequest, cancelJoinRequest, acceptJoinRequest, declineJoinRequest, getMembers, getMembershipRequests, removeMember, leaveCommunity, createCommunity, deleteCommunity};
}