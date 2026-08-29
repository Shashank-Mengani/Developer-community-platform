import { useEffect, useState } from "react";
import api from "../services/api";
import { useOutletContext } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { postsRefresh } = useOutletContext();


    useEffect(() => {

        const fetchPosts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/post");

                setPosts(response.data.data || []);

            } catch (error) {

                console.log(
                    "FETCH POSTS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load posts"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchPosts();

    }, [postsRefresh]);


    return (
        <div className="max-w-2xl mx-auto px-4 py-8">

            <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Home
            </h1>


            {/* Loading */}

            {loading && (
                <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">
                        Loading posts...
                    </p>
                </div>
            )}


            {/* Error */}

            {error && !loading && (
                <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}


            {/* Posts */}

            {!loading && !error && (
                <div className="space-y-6">

                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                            />
                        ))
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-500">
                                No posts yet.
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                                Be the first to create a post!
                            </p>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default Home;