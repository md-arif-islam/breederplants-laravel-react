import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import breederplantsLogo from "../assets/images/logo.png";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(formData);

        if (user.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/");
        }
    };

    useEffect(() => {
        document.title = "Login - Breederplants";
    }, []);

    return (
        // <div className="container max-w-[900px] mx-auto px-4  py-16 md:py-32">
        <div className="container max-w-[900px] mx-auto px-4 flex justify-center items-center h-screen">
            <div className="bg-white w-full flex flex-col items-center">
                {/* Logo */}
                <div className=" mb-12">
                    <img
                        src={breederplantsLogo}
                        alt="Breederplants Logo"
                        className="w-full h-auto"
                    />
                </div>

                {/* Login Form */}
                <div className="w-full space-y-14">
                    <div className="space-y-2">
                        <h1 className="font-poppins text-[22px] font-bold text-[#292d32]">
                            Welcome User!
                        </h1>
                        <p className="font-inter text-[#465b52] text-[13px] ">
                            Enter your Email address and Password and enjoy our
                            app
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Company Email"
                                    className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm font-normal placeholder:text-[#292d32] placeholder:font-normal w-full h-14 px-6 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm font-normal placeholder:text-[#292d32] placeholder:font-normal w-full h-14 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <a
                                href="/forgot-password"
                                className="text-primary hover:text-primary text-sm"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        <div className="border rounded-full p-2">
                            <button
                                type="submit"
                                className="w-full h-12 rounded-full text-lg bg-primary hover:bg-secondary text-white font-bold transition-colors flex items-center justify-center"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    </>
                                ) : (
                                    "Log In"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
