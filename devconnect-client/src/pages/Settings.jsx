import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Settings = () => {

    const navigate = useNavigate();

    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();

        navigate("/signin");
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <main className="max-w-2xl mx-auto px-4 py-8">

                {/* Header */}

                <div className="mb-6">

                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900 mt-4">
                        Settings
                    </h1>

                </div>


                {/* Account */}

                <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="p-5 border-b border-gray-200">

                        <h2 className="font-semibold text-gray-900">
                            Account
                        </h2>

                    </div>

                    <div className="p-5 space-y-5">

                        <div>

                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p className="font-medium text-gray-900 mt-1">
                                {user?.name}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-medium text-gray-900 mt-1">
                                {user?.email}
                            </p>

                        </div>

                    </div>

                </section>


                {/* Navigation */}

                <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                    >

                        <div>

                            <p className="font-medium text-gray-900">
                                Profile
                            </p>

                            <p className="text-sm text-gray-500">
                                View your profile
                            </p>

                        </div>

                        <span className="text-gray-400">
                            →
                        </span>

                    </button>

                </section>


                {/* Sign out */}

                <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">

                    <button
                        onClick={handleSignOut}
                        className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                        Sign out
                    </button>

                </section>

            </main>

        </div>
    );
};

export default Settings;