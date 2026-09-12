import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {

    const { user, loading } = useAuth();
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchPosts = async () => {
            if(!user?._id) return;

            try {
                const response = await api.get(
                    `/post/user/${user._id}`
                );

                setPosts(response.data.data);

            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch posts"
                );

                setPosts([]);
            }
        }
        fetchPosts();
    }, [user?._id]);

    const postsCount = posts.length;

    const followersCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;

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

                        <div className="flex items-center justify-center gap-10 mt-6">

                            {/* posts */}
                            <div className="flex flex-col items-center">
                                <strong className="text-lg font-bold text-gray-900">
                                    {postsCount}
                                </strong>
                                <span className="text-sm text-gray-500">Posts</span>
                            </div>
                            
                            {/* followers */}
                            <div className="flex flex-col items-center">
                                <strong className="text-lg font-bold text-gray-900">
                                    {followersCount}
                                </strong>
                                <span className="text-sm text-gray-500">
                                    Followers
                                </span>
                            </div>

                            {/* following */}
                            <div className="flex flex-col items-center">
                                <strong className="text-lg font-bold text-gray-900">
                                    {followingCount}
                                </strong>
                                <span className="text-sm text-gray-500">
                                    Following
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Profile;