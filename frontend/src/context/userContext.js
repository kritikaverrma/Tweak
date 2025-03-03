import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [user, setUser] = useState({});


    return <AuthContext.Provider value={{
        authUser, setAuthUser, user, setUser
    }}>
        {children}

    </AuthContext.Provider>
}