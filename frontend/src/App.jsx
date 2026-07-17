import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import AllTasks from "./components/AllTasks";
import CompletedTasks from "./components/CompletedTasks";
import PendingTasks from "./components/PendingTasks";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, createContext } from "react";
import Profile from "./components/Profile/Profile";

const taskContext = createContext();

function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [userName, setUserName] = useState("user");
  const [userEmail, setUserEmail] = useState("user@gmail.com");
  const [image, setImage] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [theme, setTheme] = useState("");
  // isGuest: true when no token — used to gate protected actions without hard redirects
  const isGuest = !localStorage.getItem("token");

  return (
    <taskContext.Provider
      value={{
        tasks,
        setTasks,
        pendingTasks,
        setPendingTasks,
        completedTasks,
        setCompletedTasks,
        error,
        setError,
        loading,
        setLoading,
        taskToEdit,
        setTaskToEdit,
        open,
        setOpen,
        confirmDelete,
        setConfirmDelete,
        taskToDelete,
        setTaskToDelete,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        image,
        setImage,
        openImage,
        setOpenImage,
        theme,
        setTheme,
        isGuest,
      }}
    >

      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        {/*
          Main app shell — accessible to everyone.
          Guests see the UI but protected actions redirect to /login.
          Profile is still hard-protected since it has no guest-preview value.
        */}
        <Route path="/" element={<Layout />}>
          <Route index element={<AllTasks />} />
          <Route path="allTasks" element={<AllTasks />} />
          <Route path="completedTasks" element={<CompletedTasks />} />
          <Route path="pendingTasks" element={<PendingTasks />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </taskContext.Provider>
  );
}

export default App;
export { taskContext };
