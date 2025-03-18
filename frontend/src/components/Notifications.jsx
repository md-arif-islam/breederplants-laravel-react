import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AdminImg from "../assets/images/admin.svg";
import NotificationImg from "../assets/images/notification-bing.svg";
import SRImg from "../assets/images/sales-report.svg";
import LogoutImg from "../assets/images/Log_Out.svg";
import { useStore } from "../store/useStore";
import echo from "../lib/echo";
import { useNotificationStore } from "../store/useNotificationStore";
import { FileChartColumn, Home } from "lucide-react";

const Notifications = () => {
    const { logout, authUser } = useStore();
    const {
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
        markAllAsRead,
        getNotifications,
    } = useNotificationStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Wrap the icon + dropdown content in a ref
    const dropdownContainerRef = useRef(null);

    // Subscribe to the private channel for the logged-in user
    useEffect(() => {
        if (authUser && authUser.id) {
            const channelName = `App.Models.User.${authUser.id}`;

            // Load existing notifications
            getNotifications();

            // Subscribe to push notifications
            const channel = echo
                .private(channelName)
                .notification((notification) => {
                    console.log("New notification received:", notification);

                    // Normalize the push notification
                    const normalizedNotification = {
                        id: notification.id,
                        type: notification.type,
                        data: {
                            message:
                                notification.data?.message ||
                                "No message provided",
                            variety_report_id:
                                notification.data?.variety_report_id || null,
                            url: notification.data?.url || "#",
                        },
                        read_at: notification.read_at || null,
                        created_at:
                            notification.created_at || new Date().toISOString(),
                        updated_at:
                            notification.updated_at || new Date().toISOString(),
                    };

                    console.log(
                        "Normalized notification:",
                        normalizedNotification
                    );

                    // Update notifications using a functional style and update unread count
                    setNotifications((prev) => {
                        const previousNotifications = Array.isArray(prev)
                            ? prev
                            : [];
                        console.log(
                            "Previous notifications:",
                            previousNotifications
                        );
                        const newNotifications = [
                            normalizedNotification,
                            ...previousNotifications,
                        ];
                        console.log(
                            "New notifications array:",
                            newNotifications
                        );
                        setUnreadCount(
                            newNotifications.filter((n) => !n.read_at).length
                        );
                        return newNotifications;
                    });
                });

            return () => {
                echo.leave(`private-${channelName}`);
            };
        }
    }, [authUser, getNotifications, setNotifications, setUnreadCount]);

    // Close dropdown if user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownContainerRef.current &&
                !dropdownContainerRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Mark all as read when dropdown is opened
    useEffect(() => {
        if (dropdownOpen) {
            markAllAsRead();
        }
    }, [dropdownOpen, markAllAsRead]);

    return (
        // Removed 'relative' here so the dropdown can be positioned via 'fixed'
        <div className="flex flex-row items-center justify-center ">
            {authUser?.role === "admin" && (
                <Link to="/admin/dashboard" className="notification mx-1">
                    <img
                        className="w-9 h-9 bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300"
                        src={AdminImg}
                        alt="Admin"
                    />
                </Link>
            )}

            {authUser?.role != "admin" && (
                <Link to="/" className="notification mx-1">
                    <Home className="w-9 h-9 text-primary bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300" />
                </Link>
            )}

            {/* Container for notification icon and dropdown */}
            <div
                className="notification relative mx-1"
                ref={dropdownContainerRef}
            >
                {/* Notification Icon + Badge */}
                <div
                    className="cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {unreadCount > 0 && (
                        <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full text-sm px-1 py-0 z-10">
                            {unreadCount}
                        </span>
                    )}
                    <img
                        id="notification-icon"
                        src={NotificationImg}
                        alt="Notifications"
                        className="w-9 h-9 bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* DROPDOWN pinned to the far right of the screen */}
                {dropdownOpen && (
                    <div className="bg-white rounded-lg w-72 sm:w-80 md:w-[600px] fixed sm:absolute top-20 right-5 sm:right-0 shadow-xl z-20">
                        <div className="notification-header p-4 border-b top-0">
                            <h5 className="text-base lg:text-md font-bold text-[#222222]">
                                Notifications
                            </h5>
                        </div>
                        <div className="notifications p-2 space-y-2 max-h-72 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md flex text-[#333] justify-between items-center border-b ${
                                            notification.read_at
                                                ? "bg-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <span
                                            className="text-sm md:text-base lg:text-md notification-span"
                                            dangerouslySetInnerHTML={{
                                                __html: notification.data
                                                    .message,
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-orange-500 text-base lg:text-md mx-1">
                                    No notifications found
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sales Reports */}
            <Link to="/sales-reports" className="notification mx-1">
                <img
                    src={SRImg}
                    className="w-9 h-9 bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300"
                    alt="Sales Reports"
                />
            </Link>

            {/* Production Reports */}
            <Link to="/production-reports" className="notification mx-1">
                <FileChartColumn className="w-9 h-9 text-primary bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* Logout */}
            <button onClick={logout} className="notification mx-1">
                <img
                    src={LogoutImg}
                    className="w-9 h-9 bg-white p-2 rounded-md hover:scale-110 transition-transform duration-300"
                    alt="Logout"
                />
            </button>
        </div>
    );
};

export default Notifications;
