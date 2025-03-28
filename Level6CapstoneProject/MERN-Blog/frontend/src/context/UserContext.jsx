import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext();

export const userAxios = axios.create();

// Axios interceptors to append the Authorization header
userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// UserProvider Component
export default function UserProvider(props) {
  const navigate = useNavigate();

  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || null, // Initialize favorites
    token: localStorage.getItem("token") || "",
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);
  const [loading, setLoading] = useState(true); // Add loading state
  const [allComments, setAllComments] = useState([]);

  // Fetch user data when the app initializes
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await userAxios.get("/api/auth/user");
        setUserState((prevState) => ({
          ...prevState,
          user: res.data, // Update the user data from the backend
        }));
      }
    } catch (err) {
      setUserState({ user: null, token: "", errMsg: "" });
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user on app load
  }, []);
  // const [blogs, setBlogs] = useState([]);

  // Signup
  const signup = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/signup", credentials);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
      navigate("/login"); // Redirect after successful signup
    } catch (err) {
      handleAuthErr(err.response?.data?.errMsg);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/login", credentials); // Ensure credentials = { email, password }
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
      navigate("/profile"); // Redirect after successful login
    } catch (err) {
      handleAuthErr(err.response?.data?.errMsg);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState({
      user: {},
      token: "",
    });
    setAllComments([]);
    navigate("/login");
  };

  // Handle Auth Error
  const handleAuthErr = (errMsg) => {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg,
    }));
  };

  // Reset Auth Error
  const resetAuthErr = () => {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg: "",
    }));
  };

  // Get All Comments
  const getAllComments = async () => {
    try {
      const res = await userAxios.get("/api/comments");
      setAllComments(res.data);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  // Add a Comment
  const addComment = async (blogId, comment) => {
    try {
      const res = await userAxios.post(`/api/comments/${blogId}`, comment);
      setAllComments((prevAllComments) => [...prevAllComments, res.data]);
    } catch (err) {
      console.log("Error adding comment:", err);
    }
  };
  const updateFavorites = async (blogId) => {
    try {
      const res = await userAxios.put(`/api/blog/favorites/${blogId}`);
      const { userFavorites } = res.data; // Get the updated favorites array from the response

      // Update the user's state with the new favorites list
      setUserState((prevUserState) => ({
        ...prevUserState,
        user: { ...prevUserState.user, favorites: userFavorites },
      }));
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        resetAuthErr,
        getAllComments,
        allComments,
        addComment,
        updateFavorites,
        loading,
        setUserState,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
