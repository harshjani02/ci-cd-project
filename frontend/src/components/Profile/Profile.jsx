import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taskContext } from "../../App";
import { useForm } from "react-hook-form";
import { SquareUserRound, ShieldCheck } from "lucide-react";

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
const labelCls = "block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide";

function Profile() {
  const { image, setImage, userName, setUserName, userEmail, setUserEmail } = useContext(taskContext);
  const url = "https://task-manager-backend-srzi.onrender.com";

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }, reset: resetProfile } = useForm({ defaultValues: { name: userName, email: userEmail } });
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword }, reset: resetPassword } = useForm();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(url + "/api/user/myDetails", { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success) {
          const { name, email, imageUrl } = response.data.user;
          setUserName(name); setUserEmail(email); setImage(imageUrl);
          resetProfile({ name, email });
        }
      } catch (error) { console.log("Error fetching userData", error); }
    };
    getUserDetails();
  }, [resetProfile]);

  const handlePersonalInfo = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login.", { autoClose: 1000 }); return; }
    try {
      const response = await axios.put(url + "/api/user/updateProfile", data, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Profile updated!", { autoClose: 1000 });
      setUserName(response.data.user.name);
      setUserEmail(response.data.user.email);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.", { autoClose: 1500 });
    }
  };

  const handlePasswordChange = async (data) => {
    const token = localStorage.getItem("token");
    if (data.newPassword !== data.confirmPassword) { toast.error("Passwords don't match", { autoClose: 1500 }); return; }
    if (!token) { toast.error("Please login.", { autoClose: 1000 }); return; }
    try {
      await axios.put(url + "/api/user/updatePassword", data, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Password updated!", { autoClose: 1000 });
      resetPassword();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password.", { autoClose: 1000 });
      resetPassword();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {/* Personal Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <SquareUserRound size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Personal Information</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmitProfile(handlePersonalInfo)}>
            <div>
              <label className={labelCls}>Name</label>
              <input type="text" {...registerProfile("name", { required: "Name is required" })} className={`${inputCls} ${profileErrors.name ? "border-red-400" : ""}`} />
              {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" placeholder="you@example.com" {...registerProfile("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} className={`${inputCls} ${profileErrors.email ? "border-red-400" : ""}`} />
              {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmittingProfile} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
              {isSubmittingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Security</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmitPassword(handlePasswordChange)}>
            <div>
              <label className={labelCls}>Current Password</label>
              <input type="password" placeholder="••••••••" {...registerPassword("currentPassword", { required: "Current password is required" })} className={`${inputCls} ${passwordErrors.currentPassword ? "border-red-400" : ""}`} />
              {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input type="password" placeholder="••••••••" {...registerPassword("newPassword", { required: "New password is required", minLength: { value: 6, message: "At least 6 characters" } })} className={`${inputCls} ${passwordErrors.newPassword ? "border-red-400" : ""}`} />
              {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Confirm Password</label>
              <input type="password" placeholder="••••••••" {...registerPassword("confirmPassword", { required: "Please confirm your password" })} className={`${inputCls} ${passwordErrors.confirmPassword ? "border-red-400" : ""}`} />
              {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmittingPassword} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
              {isSubmittingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
