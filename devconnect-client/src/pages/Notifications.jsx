import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Notifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get(
                    "/notification/notifications"
                );

                console.log(
                    "NOTIFICATIONS:",
                    response.data
                );

                setNotifications(response.data.data || []);

            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch notifications"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading notifications...
                </p>
            </div>
        );
    }

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await api.patch(
                `/notification/notifications/${notificationId}/read`
            );

            console.log("Mark as read: ", response.data);

            setNotifications((previousNotifications) =>
                previousNotifications.map((notification) => (
                    notification._id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
                )
            )
        );

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to mark notification as read"
            );
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            const response = await api.patch(
                "/notification/notifications/read-all"
            );

                    console.log(
            "MARK ALL AS READ:",
            response.data
        );

        setNotifications((previousNotifications) =>
            previousNotifications.map((notification) => ({
                ...notification,
                isRead: true
            }))
        );

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to mark all notifications as read"
            );
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="border-b border-gray-200 bg-white">

                <div className="max-w-2xl mx-auto px-4 py-4">

                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Home
                    </button>

                </div>

            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

                    <div className="flex items-center justify-between border-b border-gray-200 p-5">

                        <h1 className="text-xl font-bold text-gray-900">
                            Notifications
                        </h1>

                        <button 
                            onClick={handleMarkAllAsRead}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Mark all as read
                        </button>    

                    </div>

                    <div>

                        {notifications.length === 0 ? (

                            <p className="p-6 text-center text-gray-500">
                                No notifications yet.
                            </p>

                        ) : (

                            notifications.map((notification) => (

                                <div
                                    key={notification._id}
                                    onClick={() => 
                                            handleMarkAsRead(notification._id)}
                                    className={`cursor-pointer border-b border-gray-100 p-4 transition ${
                                        notification.isRead
                                            ? "bg-white"
                                            : "bg-blue-50"
                                    }`}
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold">

                                            {notification.sender?.avatar ? (
                                                <img
                                                    src={notification.sender.avatar}
                                                    alt={notification.sender.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                notification.sender?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()
                                            )}

                                        </div>

                                        <div>

                                            <p className="text-sm text-gray-800">
                                                <span className="font-semibold">
                                                    {notification.sender?.name}
                                                </span>{" "}
                                                {notification.message}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Notifications;