import { useState } from "react";
import { useActiveSectionContext } from "../context/ActiveSectionContext";

export const usePage = () => {
  const [pageError, setPageError] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(null);

  const { setActiveSection } = useActiveSectionContext();

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  const createPage = async (name, description) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/page/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, description, userId})
    });
    
    const json = await response.json();
    if (!response.ok) {
        setPageError(json.error);
    } else {
        alert(json.message);
        setActiveSection("");
    }

    setPageLoading(false);
  }




  const searchPage = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/page/getpage?name=${name}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);
    } else {
      setPage(json);
    }
    setPageLoading(false);

  }


  const getPageAdmin = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/page/getpageadmin?name=${name}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);
      setPageLoading(false);
    } else {
      setPageLoading(false);
      return json;
    }
  }

  const getPageLikers = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/page/pagelikers?name=${name}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);
      setPageLoading(false);
    } else {
      setPageLoading(false);
      return json;
    }
    
  }

  const deletePage = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/page/delete", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: json.stringify({name})
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);

    } else {
      alert(json.message);
    }
    setPageLoading(false);

    
  }

  const addLike = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/page/addlike", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name, userId})
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);
    } else {
      alert(json.message);
    }

    setPageLoading(false);

    
  }

  const removeLike = async (name) => {
    setPageError(null);
    setPageLoading(true);
    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/page/removelike", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name, userId})
    });
    
    const json = await response.json();
    if (!response.ok) {
      setPageError(json.error);
    } else {
      alert(json.message);
    }
    setPageLoading(false);

  }

  return { createPage, deletePage, page, pageError, pageLoading, searchPage, getPageAdmin, getPageLikers, addLike, removeLike };
}
