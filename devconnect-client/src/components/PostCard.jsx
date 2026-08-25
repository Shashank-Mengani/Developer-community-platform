import { useEffect, useState } from "react";
import api from "../services/api";

const PostCard = ({ post }) => {

    const [currentPost, setCurrentPost] = useState(post);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

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

    const getReactionCount = (type) => {
        return currentPost.reactions?.filter(
            reaction => reaction.type === type
        ).length || 0;
    }

    return(
        <div>
            
            <h3>
                {currentPost.author?.name}
            </h3>
            
            <p>
                {currentPost.content}
            </p>

            {currentPost.imageUrl && (
                <img 
                    src={currentPost.imageUrl}
                    alt="post"
                />    
            )}

            <input 
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />    

            <button onClick={handleComment}>Comment</button>

 <div>
                {comments.map((comment) => (
                    <div key={comment._id}>
                        <strong>
                            {comment.author?.name}
                        </strong>

                        <p>
                            {comment.body}
                        </p>

                        <small>
                            {comment.createdAt &&
                                new Date(
                                    comment.createdAt
                                ).toLocaleString()}
                        </small>

                        <button
                            onClick={() =>
                                handleDeleteComment(comment._id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div>
                {comments.map((comment) => (
                    <div key={comment._id}>
                        <strong>{comment.author?.name}</strong>
                        <p>{comment.body}</p>
                    </div>
                ))}
            </div>

            <small>
                {new Date(currentPost.createdAt).toLocaleString()}
            </small>

            <div>
                <span>❤️ {getReactionCount("like")}</span>
                <span>💕 {getReactionCount("love")}</span>
                <span>😂 {getReactionCount("haha")}</span>
                <span>😮 {getReactionCount("wow")}</span>
                <span>😢 {getReactionCount("sad")}</span>
                <span>😡 {getReactionCount("angry")}</span>
            </div>

            <button onClick={() => handleReaction("like")}>
                ❤️ Like
            </button>

            <button onClick={() => handleReaction("love")}>
                💕 Love
            </button>

            <button onClick={() => handleReaction("haha")}>
                😂 Haha
            </button>

            <button onClick={() => handleReaction("wow")}>
                😮 Wow
            </button>

            <button onClick={() => handleReaction("sad")}>
                😢 Sad
            </button>

            <button onClick={() => handleReaction("angry")}>
                😡 Angry
            </button>

        </div>
    )
}

export default PostCard;