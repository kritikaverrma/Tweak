import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";


{/**Will be used in Home page---[feedtype=for you||following]
// and Profile Page---[feedtype=posts||likes]*/ }
function Posts({ feedType, username, userId, newPost, setNewPost }) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    const getPostEndPoint = () => {
        switch (feedType) {
            case "forYou":
                return "/api/post/all";
            case "following":
                return "/api/post/following";
            case "posts":
                return `/api/post/user/${username}`;
            case "likes":
                return `/api/post/likes/${userId}`;
            default:
                return "/api/post/all";

        }
    };

    const POST_ENDPOINT = getPostEndPoint();
    console.log(POST_ENDPOINT);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}${POST_ENDPOINT}`,
                {
                    withCredentials: true // Only if backend uses cookies
                }
            );
            setPosts(res.data);
            console.log("res(posts) at the client", res.data);
        } catch (error) {
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.message
                : "An unexpected error occurred";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        if (newPost) {
            setNewPost(false);
        }
    }, [feedType, username, userId, newPost]);

    return (
        <>
            {isLoading && (
                <div className="flex flex-col justify-center">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}

            {!isLoading && posts.length === 0 && (
                <p className="text-center my-4">No posts 👻</p>
            )}

            {!isLoading && posts.length > 0 && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} setPosts={setPosts} setNewPost={setNewPost} />
                    ))}
                </div>
            )}
        </>
    );
}

export default Posts;
