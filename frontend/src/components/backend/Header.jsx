import { LogOutIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import UserImg from "../../assets/images/user.png";
import { PageTitleContext } from "../../context/PageTitleContext";
import { useStore } from "../../store/useStore";

const Header = ({ toggleSidebar }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { logout } = useStore();
    const { title } = useContext(PageTitleContext);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-500 focus:outline-none lg:hidden"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6H20M4 12H20M4 18H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                </button>

                <h1 className="text-xl font-bold text-gray-700">
                    {title || "Dashboard"}
                </h1>
            </div>

            <div className="flex items-center">
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="relative flex w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none"
                    >
                        <img
                            className="object-cover w-full h-full border-[3px] border-[#4CAF50] rounded-full mr-10"
                            src={UserImg}
                            alt="Your avatar"
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
                            <a
                                href="#"
                                onClick={logout}
                                className="flex px-4 py-2 text-md text-red-500 hover:bg-primary hover:text-white gap-2"
                            >
                                <LogOutIcon size={14} className="mt-1" />
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
