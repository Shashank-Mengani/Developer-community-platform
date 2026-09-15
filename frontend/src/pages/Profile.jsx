import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

const Profile = () => {
    const { user: currentUser, loading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const photoMenuRef = useRef(null);

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

    // Profile photo menu / preview
    const [showPhotoMenu, setShowPhotoMenu] = useState(false);
    const [showPhotoPreview, setShowPhotoPreview] = useState(false);

    const userId = id || currentUser?._id;

    const isOwnProfile =
        currentUser?._id?.toString() === userId?.toString();

    // Close photo menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                photoMenuRef.current &&
                !photoMenuRef.current.contains(event.target)
            ) {
                setShowPhotoMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (loading || !userId) return;

            try {
                const response = await api.get(
                    `/user/${userId}`
                );

                console.log(
                    "PROFILE RESPONSE:",
                    response.data
                );

                setProfileUser(response.data.data);

                if (
                    currentUser?._id &&
                    currentUser._id.toString() !==
                        userId.toString()
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

    // Fetch posts
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

    // Open file picker
    const handleGalleryClick = () => {
        setShowPhotoMenu(false);
        fileInputRef.current?.click();
    };

    // Profile image upload
    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Only allow images
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert(
                "Please select an image smaller than 5MB."
            );
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
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            console.log(
                "PROFILE IMAGE RESPONSE:",
                response.data
            );

            const updatedUser = response.data.data;

            setProfileUser((prev) => ({
                ...prev,
                avatar: updatedUser.avatar,
            }));

            // Clear input
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

    // Follow
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

    // Unfollow
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

            await api.delete(
                `/user/unfollow/${userId}`
            );

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

    // Posts
    const handlePosts = () => {
        setShowPosts(true);
        setShowFollowers(false);
        setShowFollowing(false);
    };

    // Followers
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

    // Following
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

    // Counts
    const postsCount = posts.length;

    const followersCount =
        profileUser?.followers?.length || 0;

    const followingCount =
        profileUser?.following?.length || 0;

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    // No user
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

    // Profile not found
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
                        <div
                            ref={photoMenuRef}
                            className="relative mb-3"
                        >

                            {/* Profile Photo */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (
                                        profileUser.avatar &&
                                        !uploadingImage
                                    ) {
                                        setShowPhotoPreview(
                                            true
                                        );
                                    }
                                }}
                                disabled={
                                    uploadingImage
                                }
                                className={`relative w-28 h-28 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 shadow-sm ${
                                    uploadingImage
                                        ? "cursor-wait"
                                        : profileUser.avatar
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                }`}
                            >
                                {profileUser.avatar ? (
                                    <img
                                        src={
                                            profileUser.avatar
                                        }
                                        alt={
                                            profileUser.name
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    profileUser.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )}

                                {/* Uploading Overlay */}
                                {uploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                        <div className="text-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1" />

                                            <span className="text-xs font-medium text-white">
                                                Uploading
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </button>

                            {/* Green Camera Button */}
                            {isOwnProfile &&
                                !uploadingImage && (
                                    <button
                                        type="button"
                                        onClick={(
                                            event
                                        ) => {
                                            event.stopPropagation();

                                            setShowPhotoMenu(
                                                (prev) =>
                                                    !prev
                                            );
                                        }}
                                        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-400 text-white shadow-md transition hover:bg-green-500 active:scale-95"
                                        aria-label="Change profile photo"
                                    >
                                        <Camera
                                            size={18}
                                            strokeWidth={
                                                2.5
                                            }
                                        />
                                    </button>
                                )}

                            {/* WhatsApp-style Photo Menu */}
                            {isOwnProfile &&
                                showPhotoMenu && (
                                    <div className="absolute left-1/2 top-full z-30 mt-3 w-52 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                                        {/* Choose From Gallery */}
                                        <button
                                            type="button"
                                            onClick={
                                                handleGalleryClick
                                            }
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-base">
                                                🖼️
                                            </span>

                                            <span>
                                                Choose
                                                from gallery
                                            </span>
                                        </button>
                                    </div>
                                )}

                            {/* Hidden File Input */}
                            {isOwnProfile && (
                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleAvatarChange
                                    }
                                    className="hidden"
                                />
                            )}
                        </div>

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
                                disabled={
                                    followLoading
                                }
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
                                onClick={
                                    handleFollowers
                                }
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
                                onClick={
                                    handleFollowing
                                }
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
                                    setShowFollowers(
                                        false
                                    )
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
                                            key={
                                                follower._id
                                            }
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
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {
                                                        follower.name
                                                    }
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
                                    setShowFollowing(
                                        false
                                    )
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
                                    (
                                        followingUser
                                    ) => (
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
                                                        ?.charAt(
                                                            0
                                                        )
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

            {/* Full-Screen Profile Photo */}
            {showPhotoPreview &&
                profileUser.avatar && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                        onClick={() =>
                            setShowPhotoPreview(
                                false
                            )
                        }
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() =>
                                setShowPhotoPreview(
                                    false
                                )
                            }
                            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
                            aria-label="Close photo"
                        >
                            ×
                        </button>

                        {/* Full Image */}
                        <img
                            src={profileUser.avatar}
                            alt={profileUser.name}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />
                    </div>
                )}
        </div>
    );
};

export default Profile;