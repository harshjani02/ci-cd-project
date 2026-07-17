import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useLocation } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Lock, CheckSquare } from "lucide-react";

const inputCls =
  "w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const url = "https://task-manager-backend-srzi.onrender.com";
  const from = location.state?.from?.pathname || "/allTasks";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(url + "/api/user/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("theme", "");
      window.location.href = from;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex flex-col">

      {/* Navbar */}
      <header className="w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-5 h-13 flex items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <CheckSquare size={16} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base text-gray-800 dark:text-white tracking-tight">
              TaskManager
            </span>
          </NavLink>
        </div>
      </header>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md px-8 py-8">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {location.state?.from
                ? "Sign in to continue where you left off."
                : "Enter your credentials to continue."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                  })}
                  className={`${inputCls} ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className={`${inputCls} ${errors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-base transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Footer links */}
          <p className="text-base text-gray-500 dark:text-gray-400 mt-5">
            Don't have an account?{" "}
            <NavLink to="/signUp" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Create one
            </NavLink>
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to app
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
