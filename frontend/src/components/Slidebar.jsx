import { Link, useNavigate, useLocation } from "react-router-dom";
import XSvg from "./X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaBookmark } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/userContext";
import { useSocket } from "../hooks/useSocket";

function Slidebar() {
    const { authUser, setAuthUser, setUser, user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch unread notifications count when sidebar loads
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/notifications/unread-count`, { withCredentials: true });
                setUnreadCount(res.data.unreadCount);
            } catch (error) {
                console.error("Error fetching unread notifications count:", error);
            }
        };

        fetchUnreadCount();
    }, [user?._id]);

    //reset notification count when user visits '/notifications'
    useEffect(() => {
        if (location.pathname === "/notifications") {
            setUnreadCount(0);
            axios.put(`${apiUrl}/api/notifications/mark-read`, {}, { withCredentials: true })
                .catch(err => console.error("Error marking notifications as read:", err));
        }
    }, [location.pathname]);

    //essentially a useEffect that re-runs when userId changes
    //passing a callback as an argument to useSocket, cb runs inside a useeffect
    //useEffect intializes a socket connection for each userId
    useSocket((newNotification) => {
        setNotifications((prev) => [{ ...newNotification }, ...prev]);
        setUnreadCount((prev) => prev + 1); // Increase badge count
    });
    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            const res = await axios.post("http://localhost:4000/api/auth/logout",
                {},
                {
                    withCredentials: true // Only if backend uses cookies
                }
            );
            setAuthUser(false);
            setUser({});
            navigate("/login");
            console.log("logged out", authUser, user)
        }
        catch (err) {

        }

    }

    return (
        <div className="flex-shrink group transition-all duration-300">
            <div className="sticky top-0 left-0 h-screen flex flex-col justify-between p-4 gap-4 border-r border-gray-700 w-[72px] md:w-[250px] bg-black text-white transition-all group-hover:w-[250px]">

                {/* Logo */}
                <Link to="/" className="flex items-center justify-center md:justify-start">
                    <XSvg className="px-2 w-12 h-12 rounded-full hover:bg-stone-900" />
                </Link>

                {/* Navigation Links */}
                <ul className="flex flex-col gap-3 mt-4">
                    <li className="flex justify-center md:justify-start hover:bg-stone-500 transition-all rounded-full duration-300">
                        <Link
                            to="/"
                            className="flex gap-3 items-center  rounded-full  py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                        >
                            <MdHomeFilled className="w-8 h-8" />
                            <span className="text-lg hidden md:block">Home</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start hover:bg-stone-500 rounded-full duration-300 transition-all cursor-pointer">
                        <Link
                            to="/notifications"
                            className="flex gap-3 items-center py-2 pl-2 pr-4 max-w-fit "
                        >
                            <IoNotifications className="w-6 h-6" />
                            <span>{unreadCount}</span>
                            <span className="text-lg hidden md:block">Notifications</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start hover:bg-stone-500 transition-all rounded-full duration-300 cursor-pointer">
                        <Link
                            to={`/profile/${user.username}`}
                            className="flex gap-3 items-center py-2 pl-2 pr-4 max-w-fit"
                        >
                            <FaUser className="w-6 h-6" />
                            <span className="text-lg hidden md:block">Profile</span>
                        </Link>
                    </li>

                    <li className="flex justify-center md:justify-start hover:bg-stone-500 transition-all rounded-full duration-300 cursor-pointer">
                        <Link
                            to={`/bookmarks`}
                            className="flex gap-3 items-center py-2 pl-2 pr-4 max-w-fit"
                        >
                            <FaBookmark className="w-6 h-6" />
                            <span className="text-lg hidden md:block">Bookmarks</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start hover:bg-stone-500 transition-all rounded-full duration-300 cursor-pointer">
                        <Link
                            to={`/chat`}
                            className="flex gap-3 items-center py-2 pl-2 pr-4 max-w-fit"
                        >
                            <TbMessageChatbotFilled className="w-6 h-6" />
                            <span className="text-lg hidden md:block">Messages</span>
                        </Link>
                    </li>


                </ul>

                {/* User Profile (Only if Authenticated) */}
                {authUser && (
                    <Link
                        to={`/profile/${user.username}`}
                        className="mt-auto mb-10 pl-2 pr-2 py-2 flex gap-2 items-center hover:bg-stone-500 transition-all rounded-full duration-300"
                    >
                        <div className="avatar hidden md:inline-flex">
                            <div className="w-8 rounded-full">
                                <img
                                    src={user.profileImg || "/avatar-placeholder.png"}
                                    loading="lazy"
                                    alt="User avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between flex-1">
                            <div className="hidden md:block">
                                <p className="text-white font-bold text-sm w-20 truncate">{user.fullname}</p>
                                <p className="text-blue text-sm">@{user.username}</p>
                            </div>
                            <BiLogOut
                                className="w-5 h-5 cursor-pointer hover:text-red-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                            />
                        </div>
                    </Link>
                )}
            </div>
        </div>

    );
}

export default Slidebar;
