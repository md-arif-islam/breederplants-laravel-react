import { ArrowDown, Bell, LogOut, LogOutIcon } from "lucide-react";
import React, { useState } from "react";
import UserImg from "../../assets/images/user.png";
import { useStore } from "../../store/useStore";

const Header = ({ toggleSidebar }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none lg:hidden">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 6H20M4 12H20M4 18H11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="flex mx-4 text-gray-600 focus:outline-none">
            {/* Notification icon from lucide-react */}
            <Bell size={24} />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80">
              <a
                href="#"
                className="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                <img
                  className="object-cover w-8 h-8 mx-1 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                  alt="avatar"
                />
                <p className="mx-2 text-sm">
                  <span className="font-bold" href="#">
                    Sara Salah
                  </span>{" "}
                  replied on the{" "}
                  <span className="font-bold text-indigo-400" href="#">
                    Upload Image
                  </span>{" "}
                  artical . 2m
                </p>
              </a>
              {/* Add more notification items here */}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative flex w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none">
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
                className="flex px-4 py-2 text-md text-red-500 hover:bg-primary hover:text-white gap-2">
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
