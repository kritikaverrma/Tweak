import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBookmark, FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../utils/date";
import { useContext } from "react";
import { AuthContext } from "../context/userContext";

function Post({ post }) {
    const [comment, setComment] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments);
    const { user, authUser } = useContext(AuthContext);

    const isLiked = likes.includes(user?._id ?? "");
    const isMyPost = user?._id === post.user._id;
    const formattedDate = formatPostDate(post.createdAt);

    const handleDeletePost = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:4000/api/post/${post._id}`, {
                withCredentials: true,
            });
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Post deletion failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLikePost = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await axios.put(`http://localhost:4000/api/post/like/${post._id}`, {}, { withCredentials: true });
            setLikes(res.data); // Assuming API returns updated likes array
        } catch (error) {
            toast.error("Post like failed");
        } finally {
            setIsLiking(false);
        }
    };

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

    return (

        <div className="flex gap-2 items-start p-4 border-b border-gray-700">


            <div className="avatar">
                <Link to={`/profile/${post.user.username}`} className="w-8 h-8 rounded-full overflow-hidden">
                    <img className="w-8 h-8 rounded-full" src={post.user.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
                </Link>
            </div>

            <div className="flex flex-col flex-1">
                {/* Post Header */}
                <div className="flex gap-2 items-center">
                    <Link to={`/profile/${post.user.username}`} className="font-bold">
                        {post.user.fullname}
                    </Link>
                    <span className="text-gray-700 flex gap-1 text-sm">
                        <Link to={`/profile/${post.user.username}`}>@{post.user.username}</Link>
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
                            <span className="text-sm text-slate-500 group-hover:text-sky-400">{comments.length}</span>
                        </div>
                        <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                            <div className='modal-box rounded border border-gray-300'>
                                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                    {comments.length === 0 && (
                                        <p className='text-sm text-slate-500'>
                                            No comments yet, Be the first one 😉
                                        </p>
                                    )}
                                    {comments.map((comment) => (
                                        <div key={comment._id} className='flex gap-2 items-start'>
                                            <div className='avatar'>
                                                <div className='w-8 h-8 rounded-full'>
                                                    <img
                                                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                    <span className='font-bold'>{comment.user.fullname}</span>
                                                    <span className='text-gray-700 text-sm'>
                                                        @{comment.user.username}
                                                    </span>
                                                </div>
                                                <div className='text-sm'>{comment.text}</div>
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
                        <div className="flex gap-1 items-center group cursor-pointer">
                            <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
                            <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
                        </div>

                        {/* Like Icon */}
                        <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
                            {isLiking && <LoadingSpinner size="sm" />}
                            {!isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />}
                            {isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />}
                            <span className={`text-sm ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`}>
                                {likes.length}
                            </span>
                        </div>
                    </div>

                    {/* Bookmark Icon */}
                    <div className="flex w-1/3 justify-end gap-2 items-center">
                        <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
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
                    <button className="btn btn-primary rounded-full text-white text-sm bg-gray-600 px-3 py-1">
                        {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Post;
