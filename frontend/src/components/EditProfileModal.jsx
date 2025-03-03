import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { AuthContext } from "../context/userContext";

const EditProfileModal = ({ authUser }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullname: authUser.fullname || "",
                username: authUser.username || "",
                email: authUser.email || "",
                bio: authUser.bio || "",
                link: authUser.link || "",
                newPassword: "",
                currentPassword: "",
            });
        }
    }, [authUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            await axios.put("http://localhost:4000/api/users/update", {
                fullname: formData.fullname,
                username: formData.username,
                email: formData.email,
                bio: formData.bio,
                link: formData.link,
                newPassword: formData.newPassword,
                currentPassword: formData.currentPassword,
            }, {
                withCredentials: true,
            });

            toast.success("Profile updated");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <button
                className="btn px-4 py-1.5 border border-gray-300 rounded-full text-black font-semibold hover:bg-gray-800 hover:text-white  transition"
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Edit profile
            </button>

            <dialog id="edit_profile_modal" className="modal">
                <div className="modal-box border rounded-md border-gray-700 shadow-md">
                    <h3 className="font-bold text-lg my-3">Update Profile</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.fullname}
                                name="fullname"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.username}
                                name="username"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.email}
                                name="email"
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder="Bio"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.bio}
                                name="bio"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.currentPassword}
                                name="currentPassword"
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                                value={formData.newPassword}
                                name="newPassword"
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Link"
                            className="flex-1 input border border-gray-700 rounded p-2 input-md"
                            value={formData.link}
                            name="link"
                            onChange={handleInputChange}
                        />
                        <button className="btn btn-primary rounded-full btn-sm text-white bg-blue-800" disabled={isUpdating}>
                            {isUpdating ? <LoadingSpinner /> : "Update"}
                        </button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button className="outline-none">Close</button>
                </form>
            </dialog>
        </>
    );
};

export default EditProfileModal;
