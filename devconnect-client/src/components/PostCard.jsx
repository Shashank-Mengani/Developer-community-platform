import { useEffect, useState } from "react";
import api from "../services/api";

const PostCard = ({ post }) => {

    const [currentPost, setCurrentPost] = useState(post);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [bookmark, setBookmark] = useState(null);
    const [copied, setCopied] = useState(false);

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

    useEffect(() => {
        const fetchBookmark = async () => {
            try {
                const response = await api.get(
                    `bookmark/posts/${post._id}`
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

    const handleComment = async () => {
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
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(
                `/comments/posts/${post._id}/comments/${commentId}`
            );
            console.log("delete response:", response.data);

            // Remove deleted comment from UI
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
    }

    const handleBookmark = async () => {
        try {
            const response = await api.post(
                `/bookmark/posts/${post._id}`
            );

            console.log("Bookmark response: ", response.data);

            setBookmark(response.data.data);

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to bookmark post"
            );
        }
    }

    const handleRemoveBookmark = async () => {
        try {
            const response = await api.delete(
                `/bookmark/posts/${bookmark._id}`
            );

            console.log("Remove Bookmark response: ", response.data);
            setBookmark(null);
        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to remove bookmark"
            );
        }
    }

    const handleShare = async () => {
        const postUrl = `${window.location.origin}/post/${post._id}`;

        try {
            await navigator.clipboard.writeText(postUrl);

            await api.post(
                `/notification/${post._id}/share`
            )
            
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {
            console.log(
                error.response?.data?.message ||
                "Failed to share post"
            );
        }
    };

    const getReactionCount = (type) => {
        return currentPost.reactions?.filter(
            reaction => reaction.type === type
        ).length || 0;
    }

    return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Post content */}
        <div className="p-5">

            {/* Author */}
            <div className="flex items-center mb-4">

                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {currentPost.author?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="ml-3">

                    <h3 className="font-semibold text-gray-900">
                        {currentPost.author?.name}
                    </h3>

                    <small className="text-sm text-gray-500">
                        {new Date(currentPost.createdAt).toLocaleString()}
                    </small>

                </div>

            </div>

            {/* Content */}
            <p className="text-gray-800 leading-relaxed mb-4">
                {currentPost.content}
            </p>

            {/* Image */}
            {currentPost.imageUrl && (
                <img
                    src={currentPost.imageUrl}
                    alt="Post"
                    className="w-full max-h-96 object-cover rounded-lg mb-4"
                />
            )}

            {/* Reaction counts */}
            <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4 mb-4 text-sm text-gray-600">

                <span>❤️ {getReactionCount("like")}</span>

            </div>

            {/* Reaction buttons */}
            <div className="flex flex-wrap gap-2 mb-5">

                <button
                    onClick={() => handleReaction("like")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 transition"
                >
                    ❤️ Like
                </button>

                <button
                    onClick={handleShare}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 transition"
                >
                    {copied ? "✅ Link copied!" : "🔗 Share"}
                </button>

                {/* Bookmark */}
                {bookmark ? (
                    <button
                        onClick={handleRemoveBookmark}
                        className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition"
                    >
                        🔖 Bookmarked
                    </button>
                ) : (
                    <button
                        onClick={handleBookmark}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 transition"
                    >
                        🔖 Bookmark
                    </button>
                )}

            </div>

            {/* Comments */}
            <div className="border-t border-gray-200 pt-4">

                <h4 className="font-semibold text-gray-900 mb-3">
                    Comments
                </h4>

                <div className="space-y-4">

                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="rounded-lg bg-gray-50 p-3"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <strong className="text-sm text-gray-900">
                                        {comment.author?.name}
                                    </strong>

                                    <p className="text-sm text-gray-700 mt-1">
                                        {comment.body}
                                    </p>

                                    <small className="text-xs text-gray-400">
                                        {new Date(
                                            comment.createdAt
                                        ).toLocaleString()}
                                    </small>

                                </div>

                                <button
                                    onClick={() =>
                                        handleDeleteComment(comment._id)
                                    }
                                    className="text-xs font-medium text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Add comment */}
                <div className="flex gap-2 mt-4">

                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        onClick={handleComment}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        Comment
                    </button>

                </div>

            </div>

        </div>

    </div>
);
}

export default PostCard;