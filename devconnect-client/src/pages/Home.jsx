import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const handlePostCreated = (newPost) => {
        setPosts((previousPosts) =>  [
            newPost,
            ...previousPosts
        ]);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get("/post");

                setPosts(response.data.data);
            } catch (error) {
                console.log("API ERROR:", error);

                setError(
                    error.response?.data?.message || "Failed to load posts"
                )
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Devconnect Home</h1>

            <CreatePost onPostCreated={handlePostCreated}/>

            {loading && <p>Loading posts...</p>}

            {error && <p>{error}</p>}

            {posts.map((post) => (
                <PostCard
                key={post._id}
                post={post}
                />    
            ))}
        </div>
    );
};

export default Home;