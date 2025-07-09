import React, { useContext, useState } from "react";
import XSvg from "../components/X";
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/userContext";
const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        password: "",

    })
    const { setAuthUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/api/auth/signup`,
                formData,
                { withCredentials: true }
            );
            console.log(res.data);
            toast.success("Account created successfully");
            setAuthUser(true);
            navigate("/");
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.log("Error:", error.response.data.message);
                alert(error.response.data.message); // Display the error message
            } else if (error.request) {
                // Request was made but no response received
                console.log("No response from server");
            } else {
                // Something else happened
                console.log("Error:", error.message);
            }
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <>
            <div className='max-w-screen-xl mx-auto flex  justify-center h-screen px-10'>
                <div className='flex-1 hidden lg:flex items-center  justify-center'>
                    <XSvg className=' lg:w-2/3 fill-black' />
                </div>

                <div className='flex-1 flex flex-col justify-center items-center'>
                    <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col'>
                        <XSvg className='w-24 lg:hidden fill-black' />
                        <h1 className='text-4xl font-extrabold text-black'>Join today</h1>
                        <label className='input border input-bordered p-3 w-full rounded-md flex items-center gap-2'>
                            <MdOutlineMail />
                            <input
                                type='email'
                                className='grow'
                                placeholder='Email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </label>

                        <div className="flex gap-4 flex-wrap">
                            <label className="input border input-bordered rounded-md w-full p-3 flex items-center gap-2 flex-1">
                                <FaUser />
                                <input
                                    type='text'
                                    className='grow'
                                    placeholder='Username'
                                    name='username'
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label className='input border input-bordered p-3 w-full rounded-md flex items-center gap-2 flex-1'>
                                <MdDriveFileRenameOutline />
                                <input
                                    type='text'
                                    className='grow'
                                    placeholder='Full Name'
                                    name='fullname'
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>

                        <label className='input border input-bordered w-full p-3 rounded flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type='password'
                                className='grow'
                                placeholder='Password'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </label>

                        <button className="btn p-3 rounded-md btn-primary bg-blue-500 text-white" onClick={handleSubmit}>Sign Up
                        </button>
                    </form>

                    <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                        <p className='text-black text-lg'>Already have an account?</p>
                        <Link to='/login'>
                            <button className='btn rounded-full btn-primary text-black btn-outline hover:underline w-full p-2 btn rounded-md ring-4 ring-blue-300 ring-opacity-50 animate-pulse'>Sign in</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup