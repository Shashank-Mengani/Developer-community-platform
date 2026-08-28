import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import Navbar from '../components/Navbar';
import BottomNav from "../components/BottomNav";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

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

        <Navbar />


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

        <BottomNav />

    </div>
);
};

export default Home;