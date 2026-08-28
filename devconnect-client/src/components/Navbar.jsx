import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    console.log(unreadCount);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/me");

                setUser(response.data.data);

            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch user"
                );
            }
        };

        fetchUser();

    }, []);


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
        <header className="border-b border-gray-200 bg-white">

            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">

                {/* Logo */}

                <h1
                    onClick={() => navigate("/")}
                    className="text-xl font-bold text-gray-900 cursor-pointer"
                >
                    DevConnect
                </h1>


                {/* Right side */}

                <div className="flex items-center gap-3">

                    {/* User */}

                    {user && (
                        <div className="flex items-center gap-2">

                            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold">

                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )}

                            </div>

                            <span className="text-sm font-medium text-gray-700">
                                {user.name}
                            </span>

                        </div>
                    )}


                    {/* Sign out */}

                    <button
                        onClick={() => navigate("/signout")}
                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
                    >
                        Sign out
                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar;