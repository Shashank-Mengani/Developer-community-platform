import { useState } from "react"
import api from '.././services/api'

const CreatePost = ({ onPostCreated }) => {

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    console.log(image);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const formData =new FormData();

        formData.append("content", content);

        if(image){
            formData.append("image", image);
        }

        const response = await api.post(
            "/post/user/post",
            formData,
            {
                headers: {
                    "Content-Type": undefined
                }
            }
        );

        console.log(response.data);

        onPostCreated(response.data.data);

        setContent("");
        setImage(null);

    } catch (error) {
        console.log(error.response?.data);
    }
};

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create Post
            </h2>

            <form onSubmit={handleSubmit}>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows="4"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full text-sm text-gray-600"
                />

                {image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="mt-4 h-48 w-full rounded-lg object-cover"
                    />
                )}

                <div className="flex justify-end mt-3">

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        Create Post
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreatePost;