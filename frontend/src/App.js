import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";
import RightPanel from "./components/RightPanel";
import Slidebar from "./components/Slidebar";
import axios from "axios";
import LoadingSpinner from "./components/LoadingSpinner";
import { useContext } from "react";
import { AuthContext } from "./context/userContext";

const isLoading = false;
function App() {
  const { authUser } = useContext(AuthContext);

  {/* 
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {

    const loadUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/me",
        {
          withCredentials:true,
        });
        if (!res.data.user) {
          authUser=false;
        }
        else {
          authUser = true;
        }
      }
      catch (error) {
        console.log("Error fetching user", error);
        setIsLoading(false)
      }
    }
    loadUser();

  }, [])
*/}
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return (
    <div className="App">
      <BrowserRouter>
        <div className="flex max-w-full mx-auto">
          {authUser && <Slidebar />}
          <Routes>
            <Route path="/" element={authUser ? <Home /> : <Navigate to={'/login'} />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to={'/'} />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to={'/'} />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
          </Routes>
          {authUser && <RightPanel />}
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
