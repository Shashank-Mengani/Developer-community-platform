import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">

            <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-3">

                {/* Home */}
                <button
                    onClick={() => navigate("/home")}
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


                {/* Activity */}
                <button
                    onClick={() => navigate("/notifications")}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${
                        isActive("/notifications")
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                    <span className="text-xl">
                        🔔
                    </span>

                    <span>
                        Activity
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