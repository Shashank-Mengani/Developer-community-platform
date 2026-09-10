import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthProvider";

const CreatePost = ({ onClose, onPostCreated }) => {

    const { user } = useAuth();

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [posting, setPosting] = useState(false);

    const fileInputRef = useRef(null);


    const previewUrl = useMemo(() => {
        if (!image) {
            return "";
        }

        return URL.createObjectURL(image);
    }, [image]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    const handleImageChange = (e) => {

        const selectedImage = e.target.files?.[0];

        if (!selectedImage) {
            return;
        }

        setImage(selectedImage);
    };


    const handleRemoveImage = () => {

        setImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!content.trim() && !image) {
            return;
        }

        if (posting) {
            return;
        }

        try {

            setPosting(true);

            const formData = new FormData();

            formData.append(
                "content",
                content.trim()
            );

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            const response = await api.post(
                "/post/user/post",
                formData
            );

            console.log(
                "POST CREATED:",
                response.data
            );

            onPostCreated(response.data.data);

            setContent("");
            setImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Failed to create post"
            );

        } finally {

            setPosting(false);
        }
    };


    const canPost =
        content.trim().length > 0 || image;


    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >

            {/* Modal */}

            <div
                className="flex w-full max-w-lg max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Create Post
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        ×
                    </button>

                </div>


                {/* SCROLLABLE BODY */}

                <div className="min-h-0 flex-1 overflow-y-auto">

                    <form
                        id="create-post-form"
                        onSubmit={handleSubmit}
                    >

                        {/* USER */}

                        <div className="flex items-center gap-3 px-5 pt-5">

                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">

                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    user?.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )}

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-gray-400">
                                    Public post
                                </p>

                            </div>

                        </div>


                        {/* TEXT */}

                        <div className="px-5 pt-4">

                            <textarea
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                placeholder="What's on your mind?"
                                rows={5}
                                maxLength={1000}
                                className="w-full resize-none border-none bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
                            />

                            <div className="text-right text-xs text-gray-400">
                                {content.length}/1000
                            </div>

                        </div>


                        {/* IMAGE */}

                        {previewUrl && (

                            <div className="relative mx-5 mt-4 overflow-hidden rounded-xl border border-gray-200">

                                <img
                                    src={previewUrl}
                                    alt="Selected"
                                    className="max-h-[50vh] w-full object-contain bg-gray-100"
                                />

                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-lg text-white hover:bg-black/80"
                                >
                                    ×
                                </button>

                            </div>

                        )}

                    </form>

                </div>


                {/* FOOTER - ALWAYS VISIBLE */}

                <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-3">

                    <div className="flex items-center justify-between">

                        {/* PHOTO */}

                        <div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                            >

                                <span className="text-lg">
                                    🖼️
                                </span>

                                <span>
                                    Photo
                                </span>

                            </button>

                        </div>


                        {/* POST */}

                        <button
                            type="submit"
                            form="create-post-form"
                            disabled={!canPost || posting}
                            className={`rounded-lg px-6 py-2 text-sm font-semibold text-white transition ${
                                canPost && !posting
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "cursor-not-allowed bg-gray-300"
                            }`}
                        >

                            {posting
                                ? "Posting..."
                                : "Post"}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CreatePost;