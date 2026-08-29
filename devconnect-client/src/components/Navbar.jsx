
import { useNavigate } from "react-router-dom";

const Navbar = ({ onCreatePost }) => {

    const navigate = useNavigate();

    return (

        <header className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white">

            <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">

                {/* Create Post */}

                <button
                    onClick={onCreatePost}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-700 hover:bg-gray-100 transition"
                    title="Create post"
                >
                    +
                </button>


                {/* Logo */}

                <h1
                    onClick={() => navigate("/")}
                    className="text-xl font-bold text-gray-900 cursor-pointer"
                >
                    DevConnect
                </h1>


                {/* Settings */}

                <button
                    onClick={() => navigate("/settings")}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                    title="Settings"
                >
                    ⚙️
                </button>

            </div>

        </header>
    );
};

export default Navbar;