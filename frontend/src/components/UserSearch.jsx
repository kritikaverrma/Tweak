import { useState } from "react";
import axios from "axios";

const UserSearch = ({ onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    {/*useEffect(() => {
        const fetchSuggested = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/api/users/suggested`);
                setUsers(data);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        }
    }, [])*/}


    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (query.length > 1) {
            try {
                const { data } = await axios.get(`${apiUrl}/api/users/search?query=${searchTerm}`
                    , { withCredentials: true });
                setUsers(data);
                //returns user data with _id, avatar, fullname, username
            } catch (error) {

                console.error("Error searching users:", error);
            }
        } else {
            setUsers([]);
        }
    };

    return (
        <div className="search-box flex flex-col">
            <input
                type="text"
                placeholder="Search users to Chat..."
                value={searchTerm}
                onChange={handleSearch}
                className="input"
            />
            {users.length > 0 && (
                <div className="search-results ">
                    {users.map((user) => (
                        <div key={user._id} className="user-item text-white flex mt-2 py-1 px-1 gap-2 border-b border-white-100" onClick={() => onSelectUser(user)}>
                            <img src={user.avatar || '/avatar-placeholder.png'} alt={user.username} className="avatar w-4 h-4 rounded-full flex justify-center align-center" />
                            <span className="flex-grow">{user.fullname} (@{user.username})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
