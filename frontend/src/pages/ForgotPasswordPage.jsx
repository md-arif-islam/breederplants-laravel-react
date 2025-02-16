import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import breederplantsLogo from "../assets/images/logo.png";
import { useStore } from "../store/useStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { sendResetEmail, isLoading } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendResetEmail({ email });
  };

  useEffect(() => {
    document.title = "Forgot Password - Breederplants";
  }, []);

  return (
    <div className="container max-w-[900px] mx-auto px-4 py-32">
      <div className="bg-white flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={breederplantsLogo}
            alt="Breederplants Logo"
            className="w-full h-auto"
          />
        </div>

        {/* Forgot Password Form */}
        <div className="w-full space-y-14">
          <div className="space-y-2">
            <h1 className="font-poppins text-[22px] font-bold text-[#292d32]">
              Forgot Password?
            </h1>
            <p className="font-inter text-[#465b52] text-[13px]">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Company Email"
                  className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm font-normal placeholder:text-[#292d32] placeholder:font-normal w-full h-14 px-6 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
