import { useNavigate } from "react-router-dom"
import api from "../services/api";


const Signout = () => {

    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await api.post("/auth/signout");
            navigate("/signin");

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Signout failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Sign out
                </h1>

                <p className="text-gray-500 mb-6">
                    Are you sure you want to sign out?
                </p>

                <button
                    onClick={handleSignout}
                    className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 transition"
                >
                    Sign out
                </button>

            </div>

        </div>
    );
};

export default Signout;