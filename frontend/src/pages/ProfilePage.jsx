import React, { useEffect, useRef, useState, useContext } from "react";
import ProfileHeaderSkeleton from "../components/ProfileHeaderSkeleton";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import Posts from "../components/Posts";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import EditProfileModal from "../components/EditProfileModal";
import axios from "axios";
import { formatMemberSinceDate } from "../utils/date";
import useFollow from "../hooks/useFollow";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { AuthContext } from "../context/userContext";


//user will either navigate to his profile or X's profile
//get the user from useParams
//and check if it is self or other
function ProfilePage() {
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");
    const [currentuser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [current, setCurrent] = useState({})
    const apiUrl = process.env.REACT_APP_API_URL;

    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);

    const { username } = useParams();
    const { followAndUnfollow, isPending } = useFollow();

    const { authUser, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/users/profile/${username}`,
                    { withCredentials: true });
                setCurrent(res.data);
            } catch (error) {
                console.error("Error fetching user profile", error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    const isMyProfile = user?._id === current?._id;
    const amIFollowing = user?.following.includes(current?._id?.toString() || '');

    const handleImgChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            type === "coverImg" ? setCoverImg(reader.result) : setProfileImg(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
            {isLoading && <ProfileHeaderSkeleton /> && <p>Profile</p>}
            {!isLoading && !current && <p className='text-center text-lg mt-4'>User not found</p>}
            {!isLoading && current && (
                <>
                    {/**Top bar with backarrow and username+"posts" */}
                    <div className='flex gap-10 px-4 py-2 items-center'>
                        <Link to='/'>
                            <FaArrowLeft className='w-4 h-4' />
                        </Link>
                        <div className='flex flex-col'>
                            <p className='font-bold text-lg'>{current.fullname}</p>
                            <span className='text-sm text-slate-500'>posts</span>
                        </div>
                    </div>

                    {/**cover image and change dp or cover */}
                    <div className='relative group/cover'>
                        <img src={coverImg || current.coverImg || "/girl1.png"} className='h-52 w-full object-cover' alt='cover' />
                        {isMyProfile && (
                            <div className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200' onClick={() => coverImgRef.current?.click()}>
                                <MdEdit className='w-5 h-5 text-black' />
                            </div>
                        )}
                        <input
                            type='file'
                            hidden
                            accept='image/*'
                            ref={coverImgRef}
                            onChange={(e) => handleImgChange(e, "coverImg")} />
                        <input
                            type='file'
                            hidden
                            accept='image/*'
                            ref={profileImgRef}
                            onChange={(e) => handleImgChange(e, "profileImg")} />

                        <div className='avatar absolute -bottom-16 left-4'>
                            <div className='w-32 rounded-full relative group/avatar'>
                                <img
                                    src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                                    className="rounded-full" />
                                <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                    {isMyProfile && (
                                        <MdEdit
                                            className='w-4 h-4 text-white'
                                            onClick={() => profileImgRef.current?.click()}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/** Edit Profile Modal*/}
                    <div className='flex justify-end px-4 mt-5'>
                        {isMyProfile && <EditProfileModal user={user} />}
                        {!isMyProfile && (
                            <button className='btn btn-outline w-16 h-10 text-sm text-white rounded btn-sm bg-blue-800' onClick={() => followAndUnfollow(current._id)}>
                                {isPending ? <LoadingSpinner /> : amIFollowing ? "Following" : "Follow"}
                            </button>
                        )}
                    </div>

                    {/** Info about Profile*/}
                    <div className='flex flex-col gap-4 mt-14 px-4'>
                        <div className='flex flex-col'>
                            <span className='font-bold text-lg'>{current?.fullname}</span>
                            <span className='text-sm text-slate-500'>@{current?.username}</span>
                            <span className='text-sm my-1'>{current?.bio}</span>
                        </div>

                        <div className='flex gap-2 flex-wrap'>
                            {current?.link && (
                                <div className='flex gap-1 items-center '>
                                    <>
                                        <FaLink className='w-3 h-3 text-slate-500' />
                                        <a
                                            href={`${user?.link}`}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-sm text-blue-500 hover:underline'
                                        >
                                            {user?.link}
                                        </a>
                                    </>
                                </div>
                            )}
                            <div className='flex gap-2 items-center'>
                                <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                <span className='text-sm text-slate-500'>
                                    {formatMemberSinceDate(current.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <div className='flex gap-1 items-center'>
                                <span className='font-bold text-xs'>{current?.following.length}</span>
                                <span className='text-slate-500 text-xs'>Following</span>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <span className='font-bold text-xs'>{current?.followers.length}</span>
                                <span className='text-slate-500 text-xs'>Followers</span>
                            </div>
                        </div>
                    </div>



                    {/*Choose the feedType */}
                    <div className='flex w-full border-b border-gray-700 mt-4'>
                        <div className='flex justify-center flex-1 p-3 hover:bg-secondary cursor-pointer' onClick={() => setFeedType("posts")}>
                            Posts
                        </div>
                        <div className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary cursor-pointer' onClick={() => setFeedType("likes")}>
                            Likes
                        </div>
                    </div>


                    {/**Display posts based on the feedType 
                     * feedType is a state-->whenever it changes, whole component re-renders
                    */}
                    <Posts feedType={feedType} username={username} userId={current._id} />
                </>
            )}
        </div>
    );
}

export default ProfilePage;
