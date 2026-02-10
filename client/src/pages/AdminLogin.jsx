import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../components/uiCommon";
import { API } from "../api";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "loading", message: "Authenticating..." });

    try {
      const res = await API.post("/auth/login", form);
      
      // Save authentication data
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminEmail", res.data.email);
      
      setStatus({ 
        type: "success", 
        message: "Login successful! Redirecting..." 
      });
      
      // Small delay for user to see success message
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Login error:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Invalid email or password."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-100 to-emerald-100 mb-4">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Owner Portal
          </h1>
          <p className="text-gray-600">Sign in to manage your travel business</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Shield size={24} />
              <div>
                <h2 className="text-xl font-bold">Secure Login</h2>
                <p className="text-blue-100 text-sm">Enter your credentials to continue</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition group-hover:border-blue-400"
                    placeholder="owner@example.com"
                    required
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition" size={18} />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 pr-11 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition group-hover:border-blue-400"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {status.message && (
                <div className={`rounded-xl p-4 border ${
                  status.type === "error" 
                    ? "bg-red-50 border-red-200 text-red-700"
                    : status.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                  <div className="flex items-center gap-3">
                    {status.type === "error" ? (
                      <AlertCircle size={18} />
                    ) : status.type === "success" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Sign In
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                )}
              </button>

              {/* Additional Info */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Forgot your password?{" "}
                  <a
                    href="https://wa.me/919023884833"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Security Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield size={14} />
              <span>Your credentials are securely encrypted</span>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-5 border border-blue-100 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Need help?</p>
              <p className="text-sm text-gray-600">Contact our support team</p>
            </div>
          </div>
          <a
            href="https://wa.me/919023884833"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;