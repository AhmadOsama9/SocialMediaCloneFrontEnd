import { useState, useEffect } from "react";
import { useChatContext } from "../context/chatContext";

export const useChat = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [chats, setChats] = useState([]);
  const { messages, addMessage, setMessages } = useChatContext();

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  useEffect(() => {
    getChats();
  }, [])

  const sendMessage = async (otherUserId, content) => {
    setError(null);

    const response = await fetch("https://merngymprojectbackend.onrender.com/api/chat/send", {
      method: "Post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId, otherUserId, content})
    });
    const data = await response.json();

    if (response.ok) {
      const newMessage = {
        sender: userId,
        content: content,
      }
      addMessage(newMessage);
    } else {
      setError(data.error);
    }

  }
  const sendMessageByChatId = async (chatId, content) => {
    setError(null);

    const response = await fetch("https://merngymprojectbackend.onrender.com/api/chat/sendbychatid", {
      method: "Post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId, chatId, content})
    });

    const data = await response.json();

    if (response.ok) {
      const newMessage = {
        sender: userId,
        content: content,
      }
      addMessage(newMessage);
    } else {
      setError(data.error);
    }
  }

  const getChats = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/chat/getchats?userId=${userId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (response.ok) {
        setChats(data);
    } else {
        setError(data.error);
    }
    setIsLoading(false);
  }

  const getChatMessages = async (otherUserId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://merngymprojectbackend.onrender.com/api/chat/getmessages", {
      method: "Post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId, otherUserId}),
    });

    const data = await response.json();

    if (response.ok) {
      const formattedMessages = data.map((message) => ({
        sender: message.sender,
        content: message.content,
      }));

      setMessages(formattedMessages);
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  }

  const getChatMessageByChatId = async (chatId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/chat/getchatmessagesbychatid?chatId=${chatId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (response.ok) {
        const formattedMessages = data.map((message) => ({
            sender: message.sender,
            content: message.content,
        }));

        setMessages(formattedMessages);
    } else {
        setError(data.error);
    }
    setIsLoading(false);
  }

  return { sendMessage, sendMessageByChatId, getChats, getChatMessages, getChatMessageByChatId, isLoading, error, messages, chats};
}