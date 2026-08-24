import { useState } from "react";
import api from "../services/api";

const PostCard = ({ post }) => {

    const [currentPost, setCurrentPost] = useState(post);

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