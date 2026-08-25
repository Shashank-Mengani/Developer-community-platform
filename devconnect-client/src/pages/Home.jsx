import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const handlePostCreated = (newPost) => {
        setPosts((previousPosts) =>  [
            newPost,
            ...previousPosts
        ]);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get("/post");

                setPosts(response.data.data);
            } catch (error) {
                console.log("API ERROR:", error);

                setError(
                    error.response?.data?.message || "Failed to load posts"
                )
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
    <div className="min-h-screen bg-gray-100">

        {/* Top bar */}
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">

                <h1 className="text-xl font-bold text-gray-900">
                    DevConnect
                </h1>

                <button
                    onClick={() => navigate("/signout")}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
                >
                    Sign out
                </button>

            </div>
        </header>


        {/* Main content */}
        <main className="max-w-2xl mx-auto px-4 py-8">

            <CreatePost onPostCreated={handlePostCreated} />

            {loading && (
                <p className="text-center text-gray-500 py-6">
                    Loading posts...
                </p>
            )}

            {error && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="space-y-6 mt-6">
                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                    />
                ))}
            </div>

        </main>

    </div>
);
};

export default Home;