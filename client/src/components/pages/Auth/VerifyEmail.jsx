import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import axios from "../../../api/axios";
import { toast } from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Grabbed from the Signup redirect

  // 1. Redirect if no email is present (prevents direct URL access)
  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // 2. Handle Resend Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 3. Handle Input Logic
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return toast.error("Please enter full code");

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/verify-otp", {
        email,
        otp: finalOtp
      });

      if (data.success) {
        toast.success("Email Verified! You can now login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    try {
      await axios.post("/auth/signup-temp", { email, resend: true });
      toast.success("New code sent!");
    } catch (err) {
      toast.error("Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff4db] via-[#ffeacc] to-[#fff4db] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
          <Mail className="w-8 h-8 text-orange-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900">Verify Your Email</h2>
        <p className="text-slate-600 mt-2 mb-8">
          We've sent a 6-digit code to <br />
          <span className="font-semibold text-slate-900">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="mt-8">
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="flex items-center justify-center gap-2 mx-auto text-orange-600 font-medium hover:text-orange-700 disabled:text-slate-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${timer > 0 ? "" : "animate-spin-once"}`} />
            {timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}