import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/userContext";
import axios from "axios";
import socket from "../utils/socket";
import { IoSendSharp } from "react-icons/io5";
import "./chat.css";

const Chat = ({ selectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);
    console.log(messages);
    const apiUrl = process.env.REACT_APP_API_URL;
    //const messagesEndRef = useRef(null);

    //fetch messages from /api/messages/:chatId whenever selected chat changes
    //emits a join chat event and listens to new message event
    useEffect(() => {
        console.log("useEffect in chat");
        const fetchChat = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/messages/${selectedChat}`,
                    { withCredentials: true }); // Fetch all user's chats
                setMessages(res.data);
                console.log("fetched messages", res.data);
            } catch (error) {
                console.error("Error fetching messages:");
            }

        };
        fetchChat();
        socket.emit("join chat", selectedChat);

        return () => {
            socket.off("join chat");
        };

    }, [selectedChat]);

    //runs whenever messages change i.e. new message has arrived/send
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleNewMessage = (newMsg) => {
            console.log("Received a new message:", newMsg);
            setMessages((prevMessages) => [...prevMessages, newMsg]); // ✅ Append new message properly
        };

        socket.on("new message", handleNewMessage);

        return () => {
            socket.off("new message", handleNewMessage); // ✅ Cleanup
        };
    }, []);


    // send to api to store in the database and emit event new message to the server
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            console.log("selectedchat id", selectedChat);
            console.log("newMessage", newMessage);
            const res = await axios.post(`${apiUrl}/api/messages/${selectedChat}`, { newMessage }, { withCredentials: true });
            console.log("res from the backend", res.data);
            setMessages((prevMessages) => [...prevMessages, res.data]);
            console.log("sent a message for the server to store & ")
            socket.emit("new message", res.data); // Send message in real-time
            setNewMessage("");
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Unauthorized! Redirecting to login...");
                // Option 1: Show an error message instead of redirecting
                alert("Session expired. Please log in again.");
                // Option 2: Redirect only if needed
                window.location.href = "/login";
            }
        }
    }

    return (
        <div className="chat-container relative h-screen flex flex-col">
            <div className="messages flex flex-col overflow-y-auto">
                {messages?.map((msg) => (
                    <div key={msg._id} className={`message ${msg.sender === user?._id ? "sent" : "received"}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input absolute bottom-0 w-full bg-gray-100 p-2 flex items-center" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="rounded-full border p-2 flex-grow"
                />
                <button type="submit" className=" px-2 py-1 rounded-lg"><IoSendSharp /></button>
            </form>

        </div>
    )
}

export default Chat