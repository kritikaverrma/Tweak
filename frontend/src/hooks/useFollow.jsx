import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


//custom Hook
function useFollow() {
    const [isPending, setIsPending] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const followAndUnfollow = async (userId) => {
        setIsPending(true);
        try {
            const res = await axios.post(`${apiUrl}/api/users/follow/${userId}`, {}, { withCredentials: true });
            toast.success(res.data.message || "Follow status updated");
            // Optionally, update local state or trigger a manual re-fetch if needed
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to follow");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsPending(false);
        }
    };

    return { followAndUnfollow, isPending };
}

export default useFollow;
