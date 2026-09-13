import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
    const { user: currentUser, loading } = useAuth();
    const { id } = useParams();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const navigate = useNavigate();

    // If /profile/:id -> show that user
    // If /profile -> show current logged-in user
    const userId = id || currentUser?._id;

    // Fetch profile user
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

            try {
                const response = await api.get(`/user/${userId}`);

                const fetchedUser = response.data.data;

                setProfileUser(fetchedUser);

                // Check whether current user follows this profile
                if (currentUser?._id && currentUser._id !== userId) {
                    const following = currentUser.following?.some(
                        (followingId) =>
                            followingId.toString() === userId.toString()
                    );

                    setIsFollowing(following);
                }
            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch profile"
                );

                setProfileUser(null);
            }
        };

        fetchProfile();
    }, [userId, currentUser]);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            if (!userId) return;

            try {
                const response = await api.get(
                    `/post/user/${userId}`
                );

                setPosts(response.data.data || []);
            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                    "Failed to fetch posts"
                );

                setPosts([]);
            }
        };

        fetchPosts();
    }, [userId]);

    const handleFollow = async () => {
        if (!userId || followLoading) return;

        try {
            setFollowLoading(true);

            await api.post(`/user/follow/${userId}`);

            setIsFollowing(true);

            // Update follower count immediately
            setProfileUser((prev) => ({
                ...prev,
                followers: [
                    ...(prev.followers || []),
                    currentUser._id
                ]
            }));

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to follow user"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!userId || followLoading) return;

        try {
            setFollowLoading(true);

            await api.delete(`/user/unfollow/${userId}`);

            setIsFollowing(false);

            // Update follower count immediately
            setProfileUser((prev) => ({
                ...prev,
                followers: (prev.followers || []).filter(
                    (followerId) =>
                        followerId.toString() !== currentUser._id.toString()
                )
            }));

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to unfollow user"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    const postsCount = posts.length;

    const followersCount = profileUser?.followers?.length || 0;
    const followingCount = profileUser?.following?.length || 0;

    if (loading || !profileUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    const isOwnProfile =
        currentUser?._id?.toString() === userId?.toString();

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

                            {profileUser?.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                profileUser?.name
                                    ?.charAt(0)
                                    .toUpperCase()
                            )}

                        </div>

                        {/* Name */}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {profileUser?.name}
                        </h1>

                        {/* Username */}
                        {profileUser?.username && (
                            <p className="text-sm text-gray-500 mt-1">
                                @{profileUser.username}
                            </p>
                        )}

                        {/* Email */}
                        <p className="text-gray-500 mt-1">
                            {profileUser?.email}
                        </p>

                        {/* Follow button */}
                        {!isOwnProfile && (
                            <button
                                onClick={
                                    isFollowing
                                        ? handleUnfollow
                                        : handleFollow
                                }
                                disabled={followLoading}
                                className={`mt-5 rounded-lg px-6 py-2 text-sm font-medium transition ${
                                    isFollowing
                                        ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                } ${
                                    followLoading
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                }`}
                            >
                                {followLoading
                                    ? "Please wait..."
                                    : isFollowing
                                        ? "Unfollow"
                                        : "Follow"}
                            </button>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-10 mt-6">

                            {/* Posts */}
                            <div className="flex flex-col items-center">
                                <strong className="text-lg font-bold text-gray-900">
                                    {postsCount}
                                </strong>

                                <span className="text-sm text-gray-500">
                                    Posts
                                </span>
                            </div>

                            {/* Followers */}
                            <div className="flex flex-col items-center">
                                <strong className="text-lg font-bold text-gray-900">
                                    {followersCount}
                                </strong>

                                <span className="text-sm text-gray-500">
                                    Followers
                                </span>
                            </div>

                            {/* Following */}
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