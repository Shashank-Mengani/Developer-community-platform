import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const BottomNav = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await api.get(
                    "/notification/notifications"
                );

                const notifications = response.data.data || [];

                const unread = notifications.filter(
                    (notification) => !notification.isRead
                ).length;

                setUnreadCount(unread);

            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch notifications"
                );
            }
        };

        fetchUnreadNotifications();
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">

            <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-3">

                {/* Home */}
                <button
                    onClick={() => navigate("/")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span className="text-xl">
                        🏠
                    </span>

                    <span>
                        Home
                    </span>
                </button>


                {/* Explore */}
                <button
                    onClick={() => navigate("/explore")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/explore")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span className="text-xl">
                        🔍
                    </span>

                    <span>
                        Explore
                    </span>
                </button>


                {/* Hackathons */}
                <button
                    onClick={() => navigate("/hackathon")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/hackathons")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span className="text-xl">
                        🏆
                    </span>

                    <span>
                        Hackathons
                    </span>
                </button>


                {/* Activity */}
                <button
                    onClick={() => navigate("/notifications")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/notifications")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <div className="relative">

                        <span className="text-xl">
                            🔔
                        </span>

                        {unreadCount > 0 && (
                            <span className="absolute -right-2 -top-2 min-w-5 h-5 rounded-full bg-red-500 px-1 text-xs font-bold text-white flex items-center justify-center">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}

                    </div>

                    <span>
                        Notifications
                    </span>
                </button>


                {/* Profile */}
                <button
                    onClick={() => navigate("/profile")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/profile")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span className="text-xl">
                        👤
                    </span>

                    <span>
                        Profile
                    </span>
                </button>

            </div>

        </nav>
    );
};

export default BottomNav;