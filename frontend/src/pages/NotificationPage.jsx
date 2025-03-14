import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";



const NotificationPage = () => {

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/notifications", {
                withCredentials: true,
            });
            setNotifications(res.data);
            setIsLoading(false);
        }
        catch (err) {

        }
    }

    const handleDeleteNotifications = async () => {
        try {
            await axios.delete("http://localhost:4000/api/notifications", { withCredentials: true });
            toast.success("Notifications cleared!");
            setNotifications([]); // Update UI state
        } catch (error) {
            toast.error("Failed to delete notifications");
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [])
    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>

                {/** Header-div-flex with p and div as flex-child*/}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <p className="font-bold">Notifications</p>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="m-1 cursor-pointer">
                            <IoSettingsOutline className="w-6 h-6" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <button onClick={handleDeleteNotifications}>Delete all notifications</button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/** while notifications are being fetched from the database*/}
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}

                {/**Display all the notifications or no notifications if none found */}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}

                {notifications?.map((notification) => (
                    <div className='border-b border-gray-300' key={notification._id}>
                        <div className='flex gap-2 p-4'>
                            {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                            {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                            <Link to={`/profile/${notification.from.username}`}>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img
                                            src={notification.from.profileImg || "/avatar-placeholder.png"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-bold'>@{notification.from.username}</span>{" "}
                                    {notification.type === "follow" ? "followed you" : "liked your post"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default NotificationPage;