import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


//custom Hook
function useFollow() {
    const [isPending, setIsPending] = useState(false);

    const followAndUnfollow = async (userId) => {
        setIsPending(true);
        try {
            const res = await axios.post(`http://localhost:4000/api/users/follow/${userId}`, {}, { withCredentials: true });
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
