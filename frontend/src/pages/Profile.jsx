import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

const Profile = () => {
    const { user: currentUser, loading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [showFollowers, setShowFollowers] = useState(false);

    const [following, setFollowing] = useState([]);
    const [showFollowing, setShowFollowing] = useState(false);

    const [showPosts, setShowPosts] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

    const userId = id || currentUser?._id;

    const isOwnProfile =
        currentUser?._id?.toString() === userId?.toString();

    // --------------------------------------------------
    // Fetch profile
    // --------------------------------------------------

    useEffect(() => {
        const fetchProfile = async () => {
            if (loading || !userId) return;

            try {
                const response = await api.get(`/user/${userId}`);

                console.log("PROFILE RESPONSE:", response.data);

                setProfileUser(response.data.data);

                if (
                    currentUser?._id &&
                    currentUser._id.toString() !== userId.toString()
                ) {
                    const followingUser =
                        currentUser.following?.some(
                            (followingId) =>
                                followingId.toString() ===
                                userId.toString()
                        );

                    setIsFollowing(!!followingUser);
                } else {
                    setIsFollowing(false);
                }
            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                        "Failed to fetch profile"
                );

                setProfileUser(null);
                setIsFollowing(false);
            }
        };

        fetchProfile();
    }, [userId, currentUser, loading]);

    // --------------------------------------------------
    // Fetch posts
    // --------------------------------------------------

    useEffect(() => {
        const fetchPosts = async () => {
            if (loading || !userId) return;

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
    }, [userId, loading]);

    // --------------------------------------------------
    // Upload profile image
    // --------------------------------------------------

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Only allow images
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();

            formData.append("avatar", file);

            const response = await api.put(
                "/user/profile-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(
                "PROFILE IMAGE RESPONSE:",
                response.data
            );

            const updatedUser = response.data.data;

            // Update profile immediately
            setProfileUser((prev) => ({
                ...prev,
                avatar: updatedUser.avatar,
            }));

            // Clear file input so the same image can
            // be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to upload profile image"
            );

            alert(
                error.response?.data?.message ||
                    "Failed to upload profile image"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    // --------------------------------------------------
    // Follow
    // --------------------------------------------------

    const handleFollow = async () => {
        if (
            !userId ||
            followLoading ||
            !currentUser?._id ||
            isOwnProfile
        ) {
            return;
        }

        try {
            setFollowLoading(true);

            await api.post(`/user/follow/${userId}`);

            setIsFollowing(true);

            setProfileUser((prev) => {
                if (!prev) return prev;

                const existingFollowers =
                    prev.followers || [];

                const alreadyExists =
                    existingFollowers.some(
                        (followerId) =>
                            followerId.toString() ===
                            currentUser._id.toString()
                    );

                if (alreadyExists) {
                    return prev;
                }

                return {
                    ...prev,
                    followers: [
                        ...existingFollowers,
                        currentUser._id,
                    ],
                };
            });
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to follow user"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    // --------------------------------------------------
    // Unfollow
    // --------------------------------------------------

    const handleUnfollow = async () => {
        if (
            !userId ||
            followLoading ||
            !currentUser?._id ||
            isOwnProfile
        ) {
            return;
        }

        try {
            setFollowLoading(true);

            await api.delete(`/user/unfollow/${userId}`);

            setIsFollowing(false);

            setProfileUser((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    followers: (
                        prev.followers || []
                    ).filter(
                        (followerId) =>
                            followerId.toString() !==
                            currentUser._id.toString()
                    ),
                };
            });
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to unfollow user"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    // --------------------------------------------------
    // Posts
    // --------------------------------------------------

    const handlePosts = () => {
        setShowPosts(true);
        setShowFollowers(false);
        setShowFollowing(false);
    };

    // --------------------------------------------------
    // Followers
    // --------------------------------------------------

    const handleFollowers = async () => {
        if (!userId) return;

        try {
            const response = await api.get(
                `/user/${userId}/followers`
            );

            setFollowers(response.data.data || []);

            setShowFollowers(true);
            setShowFollowing(false);
            setShowPosts(false);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to fetch followers"
            );
        }
    };

    // --------------------------------------------------
    // Following
    // --------------------------------------------------

    const handleFollowing = async () => {
        if (!userId) return;

        try {
            const response = await api.get(
                `/user/${userId}/following`
            );

            setFollowing(response.data.data || []);

            setShowFollowing(true);
            setShowFollowers(false);
            setShowPosts(false);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to fetch following"
            );
        }
    };

    // --------------------------------------------------
    // Counts
    // --------------------------------------------------

    const postsCount = posts.length;

    const followersCount =
        profileUser?.followers?.length || 0;

    const followingCount =
        profileUser?.following?.length || 0;

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    // --------------------------------------------------
    // No user
    // --------------------------------------------------

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">
                        Unable to load profile.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Profile not found
    // --------------------------------------------------

    if (!profileUser) {
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
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                        <p className="text-gray-500">
                            Profile not found.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
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

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                    <div className="flex flex-col items-center">

                        {/* Profile Image */}

                        <div className="relative mb-4">

                            <button
                                type="button"
                                onClick={() => {
                                    if (isOwnProfile) {
                                        fileInputRef.current?.click();
                                    }
                                }}
                                disabled={
                                    !isOwnProfile ||
                                    uploadingImage
                                }
                                className={`relative w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 ${
                                    isOwnProfile
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                }`}
                            >

                                {profileUser.avatar ? (
                                    <img
                                        src={profileUser.avatar}
                                        alt={profileUser.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    profileUser.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )}

                                {/* Upload overlay */}
                                {isOwnProfile && (
                                    <div className="absolute inset-0 flex items-end justify-center bg-black/0 hover:bg-black/30 transition">
                                        <span className="mb-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 hover:opacity-100">
                                            Change
                                        </span>
                                    </div>
                                )}

                                {/* Uploading */}
                                {uploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <span className="text-xs font-medium text-white">
                                            Uploading...
                                        </span>
                                    </div>
                                )}

                            </button>

                            {/* Hidden file input */}
                            {isOwnProfile && (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            )}

                        </div>

                        {/* Change photo text */}
                        {isOwnProfile && (
                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={uploadingImage}
                                className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                                {uploadingImage
                                    ? "Uploading..."
                                    : "Change profile photo"}
                            </button>
                        )}

                        {/* Name */}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {profileUser.name}
                        </h1>

                        {/* Username */}
                        {profileUser.username && (
                            <p className="text-sm text-gray-500 mt-1">
                                @{profileUser.username}
                            </p>
                        )}

                        {/* Email */}
                        {profileUser.email && (
                            <p className="text-gray-500 mt-1">
                                {profileUser.email}
                            </p>
                        )}

                        {/* Follow */}
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
                            <button
                                onClick={handlePosts}
                                className="flex flex-col items-center hover:opacity-70"
                            >
                                <strong className="text-lg font-bold text-gray-900">
                                    {postsCount}
                                </strong>

                                <span className="text-sm text-gray-500">
                                    Posts
                                </span>
                            </button>

                            {/* Followers */}
                            <button
                                onClick={handleFollowers}
                                className="flex flex-col items-center hover:opacity-70"
                            >
                                <strong className="text-lg font-bold text-gray-900">
                                    {followersCount}
                                </strong>

                                <span className="text-sm text-gray-500">
                                    Followers
                                </span>
                            </button>

                            {/* Following */}
                            <button
                                onClick={handleFollowing}
                                className="flex flex-col items-center hover:opacity-70"
                            >
                                <strong className="text-lg font-bold text-gray-900">
                                    {followingCount}
                                </strong>

                                <span className="text-sm text-gray-500">
                                    Following
                                </span>
                            </button>

                        </div>

                    </div>
                </div>

                {/* Posts */}
                {showPosts && (
                    <div className="mt-6">

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Posts
                            </h2>

                            <button
                                onClick={() =>
                                    setShowPosts(false)
                                }
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                Close
                            </button>
                        </div>

                        {posts.length === 0 ? (
                            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                                <p className="text-gray-500">
                                    No posts yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                )}

                {/* Followers */}
                {showFollowers && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">

                        <div className="flex items-center justify-between mb-4">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Followers
                            </h2>

                            <button
                                onClick={() =>
                                    setShowFollowers(false)
                                }
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                Close
                            </button>

                        </div>

                        {followers.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No followers yet.
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {followers.map(
                                    (follower) => (
                                        <div
                                            key={follower._id}
                                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                                        >

                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600 overflow-hidden">

                                                {follower.avatar ? (
                                                    <img
                                                        src={
                                                            follower.avatar
                                                        }
                                                        alt={
                                                            follower.name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    follower.name
                                                        ?.charAt(0)
                                                        .toUpperCase()
                                                )}

                                            </div>

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {follower.name}
                                                </p>

                                                {follower.username && (
                                                    <p className="text-sm text-gray-500">
                                                        @
                                                        {
                                                            follower.username
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                )}

                {/* Following */}
                {showFollowing && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">

                        <div className="flex items-center justify-between mb-4">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Following
                            </h2>

                            <button
                                onClick={() =>
                                    setShowFollowing(false)
                                }
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                Close
                            </button>

                        </div>

                        {following.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No followings yet.
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {following.map(
                                    (followingUser) => (
                                        <div
                                            key={
                                                followingUser._id
                                            }
                                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                                        >

                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600 overflow-hidden">

                                                {followingUser.avatar ? (
                                                    <img
                                                        src={
                                                            followingUser.avatar
                                                        }
                                                        alt={
                                                            followingUser.name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    followingUser.name
                                                        ?.charAt(0)
                                                        .toUpperCase()
                                                )}

                                            </div>

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {
                                                        followingUser.name
                                                    }
                                                </p>

                                                {followingUser.username && (
                                                    <p className="text-sm text-gray-500">
                                                        @
                                                        {
                                                            followingUser.username
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                )}

            </main>
        </div>
    );
};

export default Profile;