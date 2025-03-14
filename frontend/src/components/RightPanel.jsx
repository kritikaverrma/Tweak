import React, { useState, useEffect } from "react";
import RightPanelSkeleton from "./RightPanelSkelton";
import { Link } from "react-router-dom";
import axios from "axios";
import useFollow from "../hooks/useFollow";
import LoadingSpinner from "../components/LoadingSpinner"


const RightPanel = () => {
    const { followAndUnfollow, isPending } = useFollow();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowed, setIsFollowed] = useState(false)

    const fetchSuggestedUsers = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/users/suggested",
                { withCredentials: true });
            console.log(res.data);
            setSuggestedUsers(res.data);
            setIsLoading(false);
        }
        catch (err) {

        }
    }

    useEffect(() => {
        fetchSuggestedUsers();
    }, [])
    return (
        <div className='hidden md:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
                <p className='font-bold text-white'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* item */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}


                    {!isLoading &&
                        suggestedUsers?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 h-8 !rounded-full'>
                                            <img src={user.profileImg || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28 text-white'>
                                            {user.fullname}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='btn bg-blue-500 text-black text-sm hover:bg-white hover:opacity-90 rounded-full px-3 py-2'
                                        onClick={(e) => {
                                            e.preventDefault()
                                            followAndUnfollow(user._id)
                                        }}
                                    >
                                        {isPending ? (<LoadingSpinner size="sm" />) : "Follow"}
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default RightPanel