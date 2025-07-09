import React, { useContext, useState } from "react";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../components/X";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/userContext";


const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const { setAuthUser, setUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/api/auth/login`,
                formData,
                {
                    withCredentials: true // Only if backend uses cookies
                }
            );
            if (res.status === 200) {
                toast.success("Logged In");
                setAuthUser(true);
                console.log("data from login", res.data);
                setUser(prevUser => ({ ...prevUser, ...res.data }))
                navigate("/");
            }
        }
        catch (err) {
            console.log("err:", err)
            toast.error(err.response?.data.message);
        }
    };

    return (
        <>
            <div className='max-w-screen-xl mx-auto flex justify-center items-center h-screen'>

                <div className=' flex-1 hidden md:flex items-center justify-center'>
                    <XSvg className='sm:w-2/3 fill-black dark:fill-white' />
                </div>

                <div className=' flex-1 flex flex-col justify-center items-center'>
                    <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                        {/*<XSvg className='w-24 lg:hidden fill-white' />*/}
                        <h1 className='text-4xl font-extrabold text-black'>{"Let's"} go.</h1>
                        <label className='w-full p-3 border rounded-md flex items-center gap-2'>
                            <MdOutlineMail />
                            <input
                                type='text'
                                className='grow focus:outline-none'
                                placeholder='username'
                                name='username'
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label className='input w-full p-3 border input-bordered rounded-md flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type='password'
                                className='grow focus:outline-none'
                                placeholder='Password'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </label>


                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300">
                            Login
                        </button>
                    </form>
                    <div className='flex flex-col gap-2 mt-4'>
                        <p className='text-black text-lg'>{"Don't"} have an account?</p>
                        <Link to='/signup'>
                            <button className='w-full border border-gray-400 text-gray-600 py-3 rounded-lg 
                   hover:bg-gray-100 transition-all'>Sign up</button>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login