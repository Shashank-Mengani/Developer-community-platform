import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const { user, loading } = useAuth();

    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
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

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                    <div className="flex flex-col items-center">

                        {/* Avatar */}

                        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">

                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase()
                            )}

                        </div>


                        {/* Name */}

                        <h1 className="text-2xl font-bold text-gray-900">
                            {user?.name}
                        </h1>


                        {/* Email */}

                        <p className="text-gray-500 mt-1">
                            {user?.email}
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Profile;