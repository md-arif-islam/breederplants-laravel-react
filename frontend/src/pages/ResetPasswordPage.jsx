import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import breederplantsLogo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    token: token,
    email: email,
  });

  const { resetPassword, isLoading } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetPassword(formData);
    navigate("/login");
  };

  useEffect(() => {
    document.title = "Reset Password - Breederplants";
  }, []);

  return (
    <div className="container max-w-[900px] mx-auto px-4 py-32">
      <div className="bg-white flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={breederplantsLogo || "/placeholder.svg"}
            alt="Breederplants Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Reset Password Form */}
        <div className="w-full space-y-14">
          <div className="space-y-2">
            <h1 className="font-poppins text-[22px] font-bold text-[#292d32]">
              Reset Your Password
            </h1>
            <p className="font-inter text-[#465b52] text-[13px]">
              Enter your new password to reset your account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm font-normal placeholder:text-[#292d32] placeholder:font-normal w-full h-14 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm font-normal placeholder:text-[#292d32] placeholder:font-normal w-full h-14 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="border rounded-full p-2">
              <button
                type="submit"
                className="w-full h-12 rounded-full text-lg bg-primary hover:bg-secondary text-white font-bold transition-colors flex items-center justify-center"
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className="text-center text-sm font-medium text-primary">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
