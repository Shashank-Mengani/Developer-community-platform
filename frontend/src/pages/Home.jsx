
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    const { postsRefresh } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/post");

                setPosts(response.data.data || []);
            } catch (error) {
                console.log("FETCH POSTS ERROR:", error);

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

    const handleSearch = async (e) => {
        const value = e.target.value;

        setSearch(value);

        if (!value.trim()) {
            setUsers([]);
            return;
        }

        try {
            const response = await api.get(
                `/user/search?q=${encodeURIComponent(value)}`
            );

            console.log("user response", response.data);

            setUsers(response.data.data || []);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to search users"
            );

            setUsers([]);
        }
    };

    const handleUserClick = (userId) => {
        setSearch("");
        setUsers([]);
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">

            <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Home
            </h1>

            {/* Search */}
            <div className="relative mb-6">

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search for a user..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                {search.trim() && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">

                        {users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() =>
                                        handleUserClick(user._id)
                                    }
                                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
                                >
                                    {/* Avatar */}
                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-100">

                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center font-semibold text-blue-600">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                    </div>

                                    {/* User information */}
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {user.name}
                                        </p>

                                        {user.username && (
                                            <p className="text-sm text-gray-500">
                                                @{user.username}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-4 text-sm text-gray-500">
                                No users found.
                            </div>
                        )}

                    </div>
                )}

            </div>

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
