import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/userContext";
import Post from "../components/Post";

const Bookmarks = () => {
    const { user, authUser } = useContext(AuthContext)
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (!user?._id) return;
        const fetchBookmarks = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${apiUrl}/api/post/bookmark/${user._id}`, {
                    withCredentials: true,
                });
                console.log("bookmarks after api call", res.data);
                setBookmarks(res.data);
            }
            catch (err) {
                toast.error("Failed to load bookmarks");
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchBookmarks();
    }, [user?._id])

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>

                {/**Upper section- not dependent on api return */}
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Bookmarks</p>
                    <div className='dropdown '>
                        <div tabIndex={0} role='button' className='m-1'>
                            <IoSettingsOutline className='w-4' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                }}>Delete all bookmarks</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}


                {bookmarks?.length === 0 && <div className='text-center p-4 font-bold'>No bookmarks 🤔</div>}

                {bookmarks?.map((bookmark, index) => (
                    <div className='border-b border-gray-700' key={index}>
                        <Post post={bookmark} />
                    </div>
                ))}
            </div>
        </>
    );
};
export default Bookmarks;