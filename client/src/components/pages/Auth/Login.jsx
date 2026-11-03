import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import Logo from '../../../assets/SandBox logo.png';
import axios from "../../../api/axios";
import { GoogleLogin } from '@react-oauth/google';
import { toast, Toaster } from 'react-hot-toast';
import { io } from "socket.io-client";
import { notifyAuthUpdated } from '../../../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setLoginError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        setLoginError("");
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(
                `${backendUrl}/api/auth/login`,
                formData
            );

            if (res.data.success && res.data.userData) {
                const { token, userData } = res.data;
                // Set token in axios headers and localStorage
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
                localStorage.setItem("role", userData.role);
                localStorage.setItem("name", userData.name);
                notifyAuthUpdated();
                // Navigate without reload - let AuthContext handle checkAuth
                // navigate(`/${userData.role.toLowerCase()}/dashboard`);
                // Determine the redirect path based on the role
                const userRole = userData.role.toLowerCase();

                if (userRole === "admin") {
                    // Send admins to their special control panel route
                    navigate("/admin/users");
                } else {
                    // Send all other roles to their standard dashboard
                    navigate(`/${userRole}/dashboard`);
                }
            } else {
                setLoginError(res.data.message || "Login failed");
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || err.message || "Server connection failed";
            setLoginError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleGoogleLogin = async (credentialResponse) => {
    //     try {
    //         const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use your env variable
    //         const res = await axios.post(`${backendUrl}/api/auth/google-login`, {
    //             token: credentialResponse.credential,
    //         });

    //         if (res.data.success) {
    //             const { token, userData } = res.data;

    //             // 1. Set Global Header
    //             axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //             // 2. Persist to LocalStorage
    //             localStorage.setItem("token", token);
    //             localStorage.setItem("role", userData.role);
    //             localStorage.setItem("name", userData.name);

    //             // 3. Redirect
    //             // Using .toLowerCase() just in case your DB roles are capitalized
    //             navigate(`/${userData.role.toLowerCase()}/dashboard`);
    //         }
    //     } catch (err) {
    //         const errorMsg = err.response?.data?.message || "Google Login failed";
    //         setLoginError(errorMsg);
    //     }
    // };

    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        setLoginError("");
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.post(`${backendUrl}/api/auth/google-login`, {
                token: credentialResponse.credential,
            });

            if (res.data.success) {
                const { token, userData } = res.data;
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
                localStorage.setItem("role", userData.role);
                localStorage.setItem("name", userData.name);
                notifyAuthUpdated();

                toast.success(`Welcome back, ${userData.name}!`);
                navigate(`/${userData.role.toLowerCase()}/dashboard`);
            }
        } catch (err) {
            // 2. Check for 404 (User not found)
            if (err.response?.status === 404) {
                toast("No account found. Let's get you registered!", {
                    icon: '👋',
                    duration: 4000
                });
                // 3. Ensure this path matches your "Role Selection" route
                navigate("/signup");
            } else {
                const errorMsg = err.response?.data?.message || "Google Login failed";
                toast.error(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff4db] via-[#ffeacc] to-[#fff4db] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="">
                            <img src={Logo} alt="SandBox Logo" className="w-13 h-13 object-contain" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-3">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-600">Sign in to your account</p>
                    </div>

                    {/* Login Error */}
                    {loginError && (
                        <p className="text-center text-red-600 font-medium mb-5">{loginError}</p>
                    )}

                    <div className="flex flex-col items-center mb-6 pt-2">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setLoginError("Google Login Failed")}
                            theme="filled_blue"
                            text="signin_with"
                            shape="pill"
                            width="100%"
                        />

                        {/* Divider */}
                        <div className="relative flex items-center w-full mt-8 mb-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                Or use email
                            </span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>
                    </div>


                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-300" : "border-slate-200"
                                        } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-300" : "border-slate-200"
                                        } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Already have an account */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
