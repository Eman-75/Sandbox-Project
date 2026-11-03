import React, { useState } from "react";
import RoleForm from "./RoleForm";
import { Zap, ArrowLeft, GraduationCap, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from '../../../assets/SandBox logo.png';

export default function Signup() {
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    if (!role) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff4db] via-[#ffeacc] to-[#fff4db] flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="">
                                <img src={Logo} alt="SandBox Logo" className="w-13 h-13 object-contain" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-lg text-slate-600">
                            Select your account type to continue
                        </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button
                            onClick={() => setRole("investor")}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-8 hover:shadow-xl transition-all text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Investor</h3>
                            <p className="text-slate-600 mb-6">SDiscover opportunities and track your portfolio</p>
                            <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
                                Continue <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>
                        <button
                            onClick={() => setRole("startup")}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-8 hover:shadow-xl transition-all text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Startup</h3>
                            <p className="text-slate-600 mb-6">Access funding opportunities and connect with investors</p>
                            <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
                                Continue <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>
                        <button
                            onClick={() => setRole("student")}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-8 hover:shadow-xl transition-all text-left group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Student</h3>
                            <p className="text-slate-600 mb-6">Showcase your ideas, find mentorship, and secure funding</p>
                            <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
                                Continue <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>
                    </div>

                    {/* Switch between Login/Signup */}
                    <div className="text-center mt-8">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <RoleForm role={role} />;
}
