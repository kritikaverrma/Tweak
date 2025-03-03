import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BsEmojiSmileFill } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

function CreatePost({ setNewPost }) {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const imgRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !img) {
            toast.error("Post cannot be empty");
            return;
        }

        setIsPending(true);
        setError(null);

        try {
            const res = await axios.post("http://localhost:4000/api/post/create",
                { img, text },
                {
                    withCredentials: true // Only if backend uses cookies
                }
            );

            toast.success("Post created successfully");
            setText("");
            setImg(null);
            setNewPost(true)
        } catch (err) {
            setError(err.response?.data?.message || "Server Error");
            toast.error("Post creation failed");
        } finally {
            setIsPending(false);
        }
    };

    const handleImgChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImg(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex p-4 items-start gap-2 border-b border-gray-300">
            {/* User Avatar Placeholder */}
            <div className="avatar">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                    <img src={"/avatar-placeholder.png"} alt="User avatar" />
                </div>
            </div>

            {/* Post Form */}
            <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
                <textarea
                    className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-300"
                    placeholder="What is happening?!"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {/* Image Preview & Remove Button */}
                {img && (
                    <div className="relative w-72 mx-auto">
                        <IoCloseSharp
                            className="absolute top-0 right-0 text-white bg-gray-300 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                                setImg(null);
                                if (imgRef.current) imgRef.current.value = "";
                            }}
                        />
                        <img src={img} className="w-full mx-auto h-72 object-contain rounded" />
                    </div>
                )}

                {/* Post Actions */}
                <div className="flex justify-between align-center border-t py-2 border-gray-300">
                    <div className="flex gap-1 items-center">
                        <CiImageOn
                            className="fill-primary w-6 h-6 cursor-pointer"
                            onClick={() => imgRef.current?.click()}
                        />
                        <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
                    </div>
                    <input type="file" accept="image/*" ref={imgRef} onChange={handleImgChange} />

                    <button className="btn btn-secondary rounded-full btn-sm text-white px-4 bg-blue-800" disabled={isPending}>
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>

                {error && <div className="text-red-500">{error}</div>}
            </form>
        </div>
    );
}

export default CreatePost;


//Has a flex-box-row with 2 flex-children 
//1. div for profile image
//2. Form
