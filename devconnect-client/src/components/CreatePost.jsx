import { useState } from "react"
import api from '.././services/api'

const CreatePost = ({ onPostCreated }) => {

    const [content, setContent] = useState("");
    console.log(content);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post(
            "/post/user/post",
            {
                content
            }
        );

        console.log(response.data);

        onPostCreated(response.data.data);

        setContent("");

    } catch (error) {
        console.log(error.response?.data);
    }
};

  return (
    <div>
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit}>
        <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />    

        <button type="submit">Create post</button>
        </form>

    </div>
  )
}

export default CreatePost