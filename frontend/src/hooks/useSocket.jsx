import { useEffect, useContext } from "react";
import socket from "../utils/socket"
import { AuthContext } from "../context/userContext";

//Initializes a Socket.IO client that connects to a server running on http://localhost:4000.
//autoConnect: false: Prevents the socket from automatically connecting when initialized. 
//It will only connect when socket.connect() is explicitly called.

export const useSocket = (handleNewNotification) => {
    const { user } = useContext(AuthContext);
    console.log("user from useSocket", user);

    useEffect(() => {
        console.log("inside useEffect");
        if (!user?._id) return;
        socket.connect(); // Manually connect the socket
        console.log("calling socket.emit");
        socket.emit("setup", user._id); //notify the server about connected user
        console.log("socket.emit called");
        socket.on("receiveNotification", (notification) => {
            console.log("event received")
            handleNewNotification(notification) //pass received notification to the cb
        });


        return () => {
            socket.off("receiveNotification")
            socket.disconnect();//disconnect on cleanup
        };
    }, [user._id, handleNewNotification]);

};
