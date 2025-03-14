import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chat from "../components/Chat"; // Import Chat Component
import UserSearch from "../components/UserSearch"
import { AuthContext } from "../context/userContext";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useContext(AuthContext);

    //fetch chats when the component renders
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/api/chat",
                    { withCredentials: true }); // Fetch all user's chats
                console.log("data from fetch chats", data);
                setChats(data);
            } catch (error) {
                if (error.response) {
                    console.error("Response Error:", error.response.status);
                    console.error("Message:", error.response.data.message);
                } else if (error.request) {
                    console.error("Request Error: No response from server");
                } else {
                    console.error("Axios Error:", error.message);
                }
            }
        };

        fetchChats();
    }, [selectedChat]);

    //h
    const handleSelectUser = async (selectedUser) => {
        console.log("user in handleSelectUser", selectedUser);
        setSelectedUser(selectedUser);

        // Check if chat with selected user already exists
        let existingChat = chats.find(chat =>
            chat.members.some(member => member._id === selectedUser._id)
        );

        if (existingChat) {
            setSelectedChat(existingChat._id);
        } else {
            // Create a new chat if it doesn't exist
            try {
                const { data } = await axios.post("http://localhost:4000/api/chat",
                    { userId: selectedUser._id },
                    { withCredentials: true }
                );
                console.log("data after handleSelectedUser calls api", data)
                setChats([...chats, data]); // Update chat list
                setSelectedChat(data._id);
            } catch (error) {
                console.error("Error creating chat:", error);
            }
        }
    };

    return (
        <div className="flex flex-grow border-r border-gray-300">
            {/* Sidebar - List of all the chats*/}
            <div className="w-1/3 bg-gray-800 p-2 flex flex-col gap-2">
                <UserSearch onSelectUser={handleSelectUser} />
                <h2 className="text-lg font-bold text-white sm:text-sm mt-2">Messages</h2>
                {/**for every chat, create a clickabe div that has avatar and username */}
                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`w-full p-2 cursor-pointer flex gap-1 text-white rounded-md ${selectedChat === chat._id ? "bg-blue-500" : "bg-gray-700"}`}
                        onClick={() => setSelectedChat(chat?._id)}
                    >
                        <img
                            className="w-8 h-8 rounded-full h-full"
                            src={chat.members.find((member) => member._id.toString() !== user._id.toString()).img || "/avatar-placeholder.png"} />
                        <div className="flex flex-col">
                            <span className="flex align-center justify-center text-md">{chat.members.find((member) => member._id.toString() !== user._id.toString()).fullname}</span>
                            <span className="flex align-center justify-center text-sm text-gray-400">@{chat.members.find((member) => member._id.toString() !== user._id.toString()).username}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="w-2/3 h-screen">
                {/**Either will display a <p> if not chat is selected or a particular selecetd chat */}
                {!selectedChat &&
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-xl">Select a chat</h1>
                        <p className="text-gray-300 text-sm">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                }
                {selectedChat && <Chat selectedChat={selectedChat} />}
            </div>
        </div>
    );
};

export default ChatList;
