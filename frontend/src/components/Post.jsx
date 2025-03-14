import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBookmark, FaRegComment, FaRegHeart, FaTrash, FaBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../utils/date";
import { useContext } from "react";
import { AuthContext } from "../context/userContext";
import { Gif } from "@giphy/react-components";

//every post is an object with all key-value pairs in the database
function Post({ post, setPosts, setNewPost }) {
    const [comment, setComment] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);
    const [isReposting, setIsReposting] = useState(false);
    const [likes, setLikes] = useState(post?.likes);
    const [comments, setComments] = useState(post.comments);
    const { user, authUser, setUser } = useContext(AuthContext);
    console.log("Post Likes (post.likes):", post.likes);
    console.log("User ID:", user._id);
    const isLiked = post?.likes?.includes(user._id);
    console.log(isLiked);
    const isBookmarked = user?.bookmarks?.includes(post?._id?.toString()) ?? false;
    const isReposted = post?.reposts?.includes(user?._id);
    const isMyPost = user?._id === post.user?._id ?? false;
    const formattedDate = formatPostDate(post.createdAt);



    const handleLikePost = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await axios.put(`http://localhost:4000/api/post/like/${post._id}`, {}, { withCredentials: true });
            setLikes(res.data); // Assuming API returns updated likes array
            console.log("updated likes", res.data);
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p._id === post._id ? { ...p, likes: res.data } : p
                )
            );

        } catch (error) {
            toast.error("Post like failed");
        } finally {
            setIsLiking(false);
        }
    };

    const handleDeletePost = async () => {
        setIsDeleting(true);
        try {
            const postId = post._id;
            await axios.delete(`http://localhost:4000/api/post/${post._id}`, {
                withCredentials: true,
            });
            toast.success("Post deleted successfully");
            setPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRepost = async (e) => {
        setIsReposting(true);
        try {
            const res = await axios.post(`http://localhost:4000/api/post/repost/${post._id}`, {}, { withCredentials: true });
            const Repost = res.data.newRepost;
            console.log("newRepost at client", Repost);
            toast.success("reposted successfully");
            setPosts((prevPosts) => [Repost, ...prevPosts]);

        }
        catch (error) {
            if (error.response) {
                // Server responded with a status code other than 2xx
                console.error("Response Error:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Headers:", error.response.headers);
                toast.error(error.response.data)
            } else if (error.request) {
                // Request was made but no response received (network error, CORS issue, server down)
                console.error("No Response Received:", error.request);
            } else {
                // Something else caused the error (wrong Axios config, syntax issue)
                console.error("Request Error:", error.message);
            }
        }
        finally {
            setIsReposting(false);
        }
    }

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (isCommenting || !comment.trim()) return;
        setIsCommenting(true);
        try {
            const res = await axios.put(`http://localhost:4000/api/post/comment/${post._id}`,
                { text: comment },
                { withCredentials: true });
            setComments(res.data); // Assuming API returns updated comments array
            setComment("");
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)
            }
            else {
                console.log("Error:", error.message)
            }
            toast.error("Commenting failed");
        } finally {
            setIsCommenting(false);
        }
    };

    const handleBookmarkPost = async (e) => {
        setIsBookmarking(true);
        try {
            const res = await axios.post(`http://localhost:4000/api/post/bookmark/${post._id}`, {}, {
                withCredentials: true,
            });
            if (!isBookmarked) { toast.success("Post bookmarked successfully"); }
            else { toast.success("Removed from bookmarks"); }
            console.log("user after", res.data.user);
            setUser({ ...user, ...res.data.user })
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status code other than 2xx
                console.error("Response Error:", error.response.data);
                console.error("Status Code:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // Request was made but no response received (network error, CORS issue, server down)
                console.error("No Response Received:", error.request);
            } else {
                // Something else caused the error (wrong Axios config, syntax issue)
                console.error("Request Error:", error.message);
            }
        }
        finally {
            setIsBookmarking(false);
        }
    }

    console.log("post.originalPost", post.originalPost);

    if (!post) return null;


    if (post.originalPost) {
        return (
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-sm">
                {/**Reposted by section at the top */}
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <BiRepost className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="font-medium">Reposted by <span className="font-medium">{post.user?.fullname}</span></span>
                </div>

                <div className="flex gap-2 items-start p-4 border-b border-gray-700">

                    {/** avatar */}
                    <div className="avatar">
                        <Link to={`/profile/${post?.user?.username}`} className="w-8 h-8 rounded-full overflow-hidden">
                            <img className="w-8 h-8 rounded-full" src={post?.originalPost?.user?.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
                        </Link>
                    </div>

                    {/** whole post--[name,username]--[content]--[icons]--[comment form]*/}
                    <div className="flex flex-col flex-1">
                        {/* Post Header */}
                        <div className="flex gap-2 items-center">
                            <Link to={`/profile/${post?.originalPost?.user?.username}`} className="font-bold">
                                {post?.originalPost?.user?.fullname}
                            </Link>
                            <span className="text-gray-700 flex gap-1 text-sm">
                                <Link to={`/profile/${post?.originalPost?.user?.username}`}>@{post?.originalPost?.user?.username}</Link>
                                <span>·</span>
                                <span>{formattedDate}</span>
                            </span>
                            {isMyPost && (
                                <span className="flex justify-end flex-1">
                                    {!isDeleting && <FaTrash className="cursor-pointer hover:text-red-500 " onClick={handleDeletePost} />}
                                    {isDeleting && <LoadingSpinner size="sm" />}
                                </span>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="flex flex-col gap-3 overflow-hidden">
                            {post.originalPost.text && <p>{post.originalPost.text}</p>}
                            {post.originalPost.gif && <img src={post.originalPost.gif} className="h-80 object-contain rounded-lg border border-gray-300" alt="" />}
                            {post.originalPost.img && <img src={post.originalPost.img} className="h-80 object-contain rounded-lg border border-gray-300" alt="" />}
                        </div>

                        {/* Post Actions */}
                        <div className="flex justify-between mt-3">
                            <div className="flex gap-4 items-center w-2/3 justify-between">
                                {/* Comment Icon */}
                                <div
                                    className="flex gap-1 items-center cursor-pointer group" onClick={() => (document.getElementById("comments_modal" + post.originalPost._id))?.showModal()}
                                >
                                    <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                                    <span className="text-sm text-slate-500 group-hover:text-sky-400">{comments?.length}</span>
                                </div>
                                <dialog id={`comments_modal${post?.originalPost?._id}`} className='modal border-none outline-none'>
                                    <div className='modal-box rounded border border-gray-300'>
                                        <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                        <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                            {comments?.length === 0 && (
                                                <p className='text-sm text-slate-500'>
                                                    No comments yet, Be the first one 😉
                                                </p>
                                            )}
                                            {comments?.map((comment) => (
                                                <div key={comment?._id} className='flex gap-2 items-start'>
                                                    <div className='avatar'>
                                                        <div className='w-8 h-8 rounded-full'>
                                                            <img
                                                                src={comment?.user?.profileImg || "/avatar-placeholder.png"}
                                                                className="rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <div className='flex items-center gap-1'>
                                                            <span className='font-bold'>{comment?.user?.fullname}</span>
                                                            <span className='text-gray-700 text-sm'>
                                                                @{comment?.user?.username}
                                                            </span>
                                                        </div>
                                                        <div className='text-sm'>{comment?.text}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <form className='flex gap-2 items-center mt-4 border-t border-gray-300 pt-2'
                                            onSubmit={handlePostComment}
                                        >
                                            <textarea
                                                className='textarea w-full p-1 rounded text-sm resize-none border focus:outline-none  border-gray-300'
                                                placeholder='Add a comment...'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <button className='btn btn-primary bg-blue-700 rounded-full btn-sm text-white px-3 py-1'>
                                                {isCommenting ? (<LoadingSpinner size="md" />) : ("Post")}
                                            </button>
                                        </form>
                                    </div>
                                    <form method='dialog' className='modal-backdrop'>
                                        <button className='outline-none rounded-full bg-gray-600 h-6 w-6 text-white'>X</button>
                                    </form>
                                </dialog>

                                {/* Repost Icon */}
                                <div className="flex gap-1 items-center group cursor-pointer" onClick={handleRepost}>
                                    {isReposting && <LoadingSpinner size="sm" />}
                                    {!isReposting && !isReposted && <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />}
                                    {!isReposting && isReposted && <BiRepost className="w-6 h-6 text-pink-500 group-hover:text-pink-500" />}
                                    <span className="text-sm text-slate-500 group-hover:text-green-500">{post?.originalPost?.reposts?.length ?? 0}</span>
                                </div>

                                {/* Like Icon */}
                                <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
                                    {isLiking && <LoadingSpinner size="sm" />}
                                    {!isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />}
                                    {isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />}
                                    <span className={`text-sm ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`}>
                                        {post?.originalPost?.likes?.length}
                                    </span>
                                </div>
                            </div>

                            {/* Bookmark Icon */}
                            <div className="flex w-1/3 justify-end gap-2 items-center" onClick={handleBookmarkPost}>
                                {isBookmarking && <LoadingSpinner size="sm" />}
                                {!isBookmarked && !isBookmarking && <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />}
                                {isBookmarked && !isBookmarking && <FaBookmark className="w-4 h-4 text-blue-500 cursor-pointer " />}
                            </div>
                        </div>

                        {/* Comment Section */}
                        <form className="flex gap-2 items-center mt-4 border-t border-gray-300 pt-2" onSubmit={handlePostComment}>
                            <textarea
                                className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-400"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button className=" dark:text-gray-300 bg-blue-500 rounded-lg text-white text-sm px-3 py-1 hover:bg-blue-600 transition-all">
                                {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )

    }

    return (

        <div className="flex gap-2 items-start p-4 border-b border-gray-700">

            <div className="avatar">
                <Link to={`/profile/${post?.user?.username}`} className="w-8 h-8 rounded-full overflow-hidden">
                    <img className="w-8 h-8 rounded-full" src={post?.user?.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
                </Link>
            </div>

            <div className="flex flex-col flex-1">
                {/* Post Header */}
                <div className="flex gap-2 items-center">
                    <Link to={`/profile/${post?.user?.username}`} className="font-bold">
                        {post?.user?.fullname}
                    </Link>
                    <span className="text-gray-700 flex gap-1 text-sm">
                        <Link to={`/profile/${post?.user?.username}`}>@{post?.user?.username}</Link>
                        <span>·</span>
                        <span>{formattedDate}</span>
                    </span>
                    {isMyPost && (
                        <span className="flex justify-end flex-1">
                            {!isDeleting && <FaTrash className="cursor-pointer hover:text-red-500 " onClick={handleDeletePost} />}
                            {isDeleting && <LoadingSpinner size="sm" />}
                        </span>
                    )}
                </div>

                {/* Post Content */}
                <div className="flex flex-col gap-3 overflow-hidden">
                    <span>{post.text}</span>
                    {post.gif && <img src={post.gif} className="h-80 object-contain rounded-lg border border-gray-300" alt="" />}
                    {post.img && <img src={post.img} className="h-80 object-contain rounded-lg border border-gray-300" alt="" />}
                </div>

                {/* Post Actions */}
                <div className="flex justify-between mt-3">
                    <div className="flex gap-4 items-center w-2/3 justify-between">
                        {/* Comment Icon */}
                        <div
                            className="flex gap-1 items-center cursor-pointer group" onClick={() => (document.getElementById("comments_modal" + post._id))?.showModal()}
                        >
                            <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                            <span className="text-sm text-slate-500 group-hover:text-sky-400">{comments?.length}</span>
                        </div>
                        <dialog id={`comments_modal${post?._id}`} className='modal border-none outline-none'>
                            <div className='modal-box rounded border border-gray-300'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {comments?.length === 0 && (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet, Be the first one 😉
                                        </p>
                                    )}
                                    {comments?.map((comment) => (
                                        <div key={comment?._id} className='flex gap-2 items-start'>
                                            <div className='avatar'>
                                                <div className='w-8 h-8 rounded-full'>
                                                    <img
                                                        src={comment?.user?.profileImg || "/avatar-placeholder.png"}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                    <span className='font-bold'>{comment?.user?.fullname}</span>
                                                    <span className='text-gray-700 text-sm'>
                                                        @{comment?.user?.username}
                                                    </span>
                                                </div>
                                                <div className='text-sm'>{comment?.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form className='flex gap-2 items-center mt-4 border-t border-gray-300 pt-2'
                                    onSubmit={handlePostComment}
                                >
                                    <textarea
                                        className='textarea w-full p-1 rounded text-sm resize-none border focus:outline-none  border-gray-300'
                                        placeholder='Add a comment...'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button className='btn btn-primary bg-blue-700 rounded-full btn-sm text-white px-3 py-1'>
                                        {isCommenting ? (<LoadingSpinner size="md" />) : ("Post")}
                                    </button>
                                </form>
                            </div>
                            <form method='dialog' className='modal-backdrop'>
                                <button className='outline-none rounded-full bg-gray-600 h-6 w-6 text-white'>X</button>
                            </form>
                        </dialog>

                        {/* Repost Icon */}
                        <div className="flex gap-1 items-center group cursor-pointer" onClick={handleRepost}>
                            {isReposting && <LoadingSpinner size="sm" />}
                            {!isReposting && !isReposted && <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />}
                            {!isReposting && isReposted && <BiRepost className="w-6 h-6 text-pink-500 group-hover:text-pink-500" />}
                            <span className="text-sm text-slate-500 group-hover:text-green-500">{post?.reposts?.length ?? 0}</span>
                        </div>

                        {/* Like Icon */}
                        <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
                            {isLiking && <LoadingSpinner size="sm" />}
                            {!isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />}
                            {isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />}
                            <span className={`text-sm ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`}>
                                {likes?.length}
                            </span>
                        </div>
                    </div>

                    {/* Bookmark Icon */}
                    <div className="flex w-1/3 justify-end gap-2 items-center" onClick={handleBookmarkPost}>
                        {isBookmarking && <LoadingSpinner size="sm" />}
                        {!isBookmarked && !isBookmarking && <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />}
                        {isBookmarked && !isBookmarking && <FaBookmark className="w-4 h-4 text-blue-500 cursor-pointer " />}
                    </div>
                </div>

                {/* Comment Section */}
                <form className="flex gap-2 items-center mt-4 border border-gray-300 dark:border-gray-700 pt-2 rounded-lg" onSubmit={handlePostComment}>
                    <textarea
                        className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-400"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="bg-blue-500 rounded-lg text-white text-sm px-3 py-1 hover:bg-blue-600 transition-all">
                        {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                    </button>
                </form>
            </div>

        </div>
    );
}

export default Post;
