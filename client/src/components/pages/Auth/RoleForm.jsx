import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Logo from '../../../assets/SandBox logo.png';
import axios from "../../../api/axios";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-hot-toast";
import { notifyAuthUpdated } from '../../../../context/AuthContext';

export default function RoleForm({ role }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role, // hidden field
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleGoogleSignup = async (credentialResponse) => {
  //   try {
  //     const res = await axios.post("/auth/google-signup", {
  //       token: credentialResponse.credential,
  //       role: role // 'investor', 'startup', or 'student'
  //     });

  //     localStorage.setItem("token", res.data.token);
  //     navigate(`/${res.data.userData.role}/dashboard`);
  //   } catch (err) {
  //     alert("Signup failed: " + err.response?.data?.message);
  //   }
  // };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await axios.post("/auth/google-signup", {
        token: credentialResponse.credential,
        role: role // 'investor', 'startup', or 'student'
      });

      if (res.data.success) {
        // "Log them in" immediately by saving the session data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.userData.role);
        localStorage.setItem("name", res.data.userData.name);

        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        notifyAuthUpdated();

        // Direct redirect to their specific dashboard
        navigate(`/${res.data.userData.role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed: " + (err.response?.data?.message || "Internal Error"));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   try {
  //     const response = await axios.post("/auth/register", {
  //       name: form.name,
  //       email: form.email,
  //       password: form.password,
  //       role: role 
  //     });

  //     if (response.status === 201) {
  //       // Green success toast
  //       toast.success("Registration Successful! Please log in.");

  //       // Navigate back to login
  //       navigate("/login");
  //     }
  //   } catch (err) {
  //     // Red error toast for a better experience
  //     toast.error(err.response?.data?.message || "Signup failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Change the endpoint to your new "Temporary" signup route
      const response = await axios.post("/auth/signup-temp", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role
      });

      if (response.data.success) {
        toast.success("Code sent! Please check your email.");

        // Navigate to the verification screen
        // We pass the email in 'state' so the next page knows who to verify
        navigate("/verify-email", { state: { email: form.email, userData: form } });
      }
    } catch (err) {
      console.log("Full Error Object:", err.response);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }

  };

  const inputClass = (error) =>
    `w-full pl-10 pr-12 py-3 rounded-xl border ${error ? "border-red-400" : "border-slate-200"
    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff4db] via-[#ffeacc] to-[#fff4db] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Sign Up Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="">
              <img src={Logo} alt="SandBox Logo" className="w-13 h-13 object-contain" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {role} Signup
            </h2>
            <p className="text-slate-600 mt-2">
              Create your account and start your journey
            </p>
          </div>

          <div className="flex flex-col items-center mb-6 pt-2">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => alert("Google Registration Failed")}
              theme="filled_blue"
              text="signup_with"
              shape="pill"
              width="300"
            />

            {/* Modern Divider */}
            <div className="relative flex items-center w-full mt-8 mb-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Or use email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={inputClass(errors.name)}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-2 ml-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={inputClass(errors.email)}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={inputClass(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-2 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={inputClass(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-2 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Hidden Role Field */}
            <input type="hidden" name="role" value={form.role} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
