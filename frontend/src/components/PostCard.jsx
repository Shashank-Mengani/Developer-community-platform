import { useEffect, useState } from "react";
import api from "../services/api";

const PostCard = ({ post }) => {
    const [currentPost, setCurrentPost] = useState(post);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [bookmark, setBookmark] = useState(null);
    const [showShareModel, setShowShareModel] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/comments/postComments/${post._id}`
                );

                console.log("COMMENTS RESPONSE:", response.data);

                setComments(response.data.data || []);
            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                        "Failed to fetch comments"
                );
            }
        };

        fetchComments();
    }, [post._id]);

    // Fetch bookmark
    useEffect(() => {
        const fetchBookmark = async () => {
            try {
                const response = await api.get(
                    `/bookmark/posts/${post._id}`
                );

                setBookmark(response.data.data);
            } catch (error) {
                console.log(
                    error.response?.data?.message ||
                        "Failed to fetch Bookmark"
                );
            }
        };

        fetchBookmark();
    }, [post._id]);

    // Reaction
    const handleReaction = async (type) => {
        try {
            const response = await api.post(
                `/post/${post._id}/reaction`,
                { type }
            );

            setCurrentPost(response.data.data);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to react to post"
            );
        }
    };

    // Add comment
    const handleComment = async () => {
        if (!comment.trim()) {
            return;
        }

        try {
            const response = await api.post(
                `/comments/post/${post._id}`,
                {
                    body: comment
                }
            );

            setComments((previousComments) => [
                ...previousComments,
                response.data.data
            ]);

            setComment("");
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to add comment"
            );
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(
                `/comments/posts/${post._id}/comments/${commentId}`
            );

            console.log("DELETE COMMENT RESPONSE:", response.data);

            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to delete comment"
            );
        }
    };

    // Add bookmark
    const handleBookmark = async () => {
        try {
            const response = await api.post(
                `/bookmark/posts/${post._id}`
            );

            console.log("BOOKMARK RESPONSE:", response.data);

            setBookmark(response.data.data);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to bookmark post"
            );
        }
    };

    // Remove bookmark
    const handleRemoveBookmark = async () => {
        if (!bookmark?._id) {
            return;
        }

        try {
            const response = await api.delete(
                `/bookmark/posts/${bookmark._id}`
            );

            console.log(
                "REMOVE BOOKMARK RESPONSE:",
                response.data
            );

            setBookmark(null);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to remove bookmark"
            );
        }
    };

    // Open share modal and fetch users
    const handleShare = async () => {
        try {
            const response = await api.get("/user");

            console.log("USERS:", response.data);

            setUsers(response.data.data || []);
            setShowShareModel(true);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to fetch users"
            );
        }
    };

    // Send post to user
    const handleSendPost = async (recipientId) => {
        try {
            const response = await api.post(
                `/notification/${post._id}/share/${recipientId}`
            );

            console.log("SHARE RESPONSE:", response.data);

            setShowShareModel(false);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                    "Failed to share post"
            );
        }
    };

    // Reaction count
    const getReactionCount = (type) => {
        return (
            currentPost.reactions?.filter(
                (reaction) => reaction.type === type
            ).length || 0
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {/* Post content */}
            <div className="p-5">

                {/* Author */}
                <div className="mb-4 flex items-center">

                    {/* Author Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">

                        {currentPost.author?.avatar ? (
                            <img
                                src={currentPost.author.avatar}
                                alt={
                                    currentPost.author.name ||
                                    "User"
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            currentPost.author?.name
                                ?.charAt(0)
                                .toUpperCase() || "U"
                        )}

                    </div>

                    {/* Author Details */}
                    <div className="ml-3">

                        <h3 className="font-semibold text-gray-900">
                            {currentPost.author?.name ||
                                "Unknown User"}
                        </h3>

                        {currentPost.author?.username && (
                            <p className="text-xs text-gray-500">
                                @{currentPost.author.username}
                            </p>
                        )}

                        <small className="text-xs text-gray-400">
                            {currentPost.createdAt
                                ? new Date(
                                      currentPost.createdAt
                                  ).toLocaleString()
                                : ""}
                        </small>

                    </div>
                </div>

                {/* Post Content */}
                <p className="mb-4 leading-relaxed text-gray-800">
                    {currentPost.content}
                </p>

                {/* Post Image */}
                {currentPost.imageUrl && (
                    <img
                        src={currentPost.imageUrl}
                        alt="Post"
                        className="mb-4 max-h-96 w-full rounded-lg object-cover"
                    />
                )}

                {/* Reaction Counts */}
                <div className="mb-4 flex flex-wrap gap-3 border-b border-gray-200 pb-4 text-sm text-gray-600">

                    <span>
                        ❤️ {getReactionCount("like")}
                    </span>

                </div>

                {/* Action Buttons */}
                <div className="mb-5 flex flex-wrap gap-2">

                    {/* Like */}
                    <button
                        onClick={() =>
                            handleReaction("like")
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-100"
                    >
                        ❤️ Like
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-100"
                    >
                        🔗 Share
                    </button>

                    {/* Bookmark */}
                    {bookmark ? (
                        <button
                            onClick={
                                handleRemoveBookmark
                            }
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                        >
                            🔖 Bookmarked
                        </button>
                    ) : (
                        <button
                            onClick={handleBookmark}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-100"
                        >
                            🔖 Bookmark
                        </button>
                    )}

                </div>

                {/* Share Modal */}
                {showShareModel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                        <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">

                            {/* Modal Header */}
                            <div className="mb-4 flex items-center justify-between">

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Share Post
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowShareModel(
                                            false
                                        )
                                    }
                                    className="text-gray-400 hover:text-gray-700"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* Users */}
                            <div className="max-h-96 space-y-3 overflow-y-auto">

                                {users.length === 0 ? (
                                    <p className="py-5 text-center text-sm text-gray-500">
                                        No users found.
                                    </p>
                                ) : (
                                    users.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                        >

                                            <div className="flex items-center gap-3">

                                                {/* User Avatar */}
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">

                                                    {user.avatar ? (
                                                        <img
                                                            src={
                                                                user.avatar
                                                            }
                                                            alt={
                                                                user.name ||
                                                                "User"
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase() ||
                                                        "U"
                                                    )}

                                                </div>

                                                {/* User Details */}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {
                                                            user.name
                                                        }
                                                    </p>

                                                    {user.username && (
                                                        <p className="text-xs text-gray-500">
                                                            @
                                                            {
                                                                user.username
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                            </div>

                                            {/* Send */}
                                            <button
                                                onClick={() =>
                                                    handleSendPost(
                                                        user._id
                                                    )
                                                }
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                            >
                                                Send
                                            </button>

                                        </div>
                                    ))
                                )}

                            </div>

                        </div>

                    </div>
                )}

                {/* Comments */}
                <div className="border-t border-gray-200 pt-4">

                    <h4 className="mb-3 font-semibold text-gray-900">
                        Comments
                    </h4>

                    {/* Existing Comments */}
                    <div className="space-y-4">

                        {comments.length === 0 ? (
                            <p className="text-sm text-gray-400">
                                No comments yet.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="rounded-lg bg-gray-50 p-3"
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <div>

                                            <strong className="text-sm text-gray-900">
                                                {
                                                    comment
                                                        .author
                                                        ?.name
                                                }
                                            </strong>

                                            <p className="mt-1 text-sm text-gray-700">
                                                {
                                                    comment.body
                                                }
                                            </p>

                                            <small className="text-xs text-gray-400">
                                                {comment.createdAt
                                                    ? new Date(
                                                          comment.createdAt
                                                      ).toLocaleString()
                                                    : ""}
                                            </small>

                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDeleteComment(
                                                    comment._id
                                                )
                                            }
                                            className="text-xs font-medium text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                    {/* Add Comment */}
                    <div className="mt-4 flex gap-2">

                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    comment.trim()
                                ) {
                                    handleComment();
                                }
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            onClick={handleComment}
                            disabled={!comment.trim()}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Comment
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default PostCard;