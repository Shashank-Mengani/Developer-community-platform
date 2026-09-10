import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AskQuestion = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);

        if (error) {
            setError("");
        }
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (posting) {
            return;
        }

        const cleanTitle = title.trim();
        const cleanBody = body.trim();

        if (!cleanTitle) {
            setError("Question title is required");
            return;
        }

        if (cleanTitle.length < 10) {
            setError(
                "Question title should be at least 10 characters"
            );
            return;
        }

        if (!cleanBody) {
            setError("Question description is required");
            return;
        }

        if (cleanBody.length < 20) {
            setError(
                "Please provide more details about your question"
            );
            return;
        }

        try {

            setPosting(true);
            setError("");

            const response = await api.post(
                "/question",
                {
                    title: cleanTitle,
                    body: cleanBody
                }
            );

            console.log(
                "QUESTION CREATED:",
                response.data
            );

            const createdQuestion =
                response.data.data;

            if (!createdQuestion?._id) {
                throw new Error(
                    "Question was created but no question ID was returned"
                );
            }

            navigate(
                `/questions/${createdQuestion._id}`
            );


        } catch (error) {
            console.log(
                "QUESTION ERROR:",
                error.response?.data?.message ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to create question"
            );


        } finally {
            setPosting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">

            <div className="mx-auto max-w-3xl px-4 py-8">


                {/* Back */}

                <button
                    type="button"
                    onClick={() => navigate("/explore")}
                    className="mb-6 text-sm text-gray-500 transition hover:text-gray-900"
                >
                    ← Back to Questions
                </button>


                {/* Header */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Ask a Question
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Ask a clear question and get help from the developer community.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                    {/* Error */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>

                    )}


                    {/* Title */}

                    <div>

                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Question title
                        </label>

                        <p className="mt-1 text-xs text-gray-500">
                            Be specific and imagine you are asking another developer.
                        </p>


                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            maxLength={200}
                            disabled={posting}
                            placeholder="e.g. Why is my JWT middleware returning 401?"
                            className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                        />


                        <div className="mt-1 text-right text-xs text-gray-400">
                            {title.length}/200
                        </div>

                    </div>


                    {/* Body */}

                    <div className="mt-6">

                        <label
                            htmlFor="body"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Question details
                        </label>

                        <p className="mt-1 text-xs text-gray-500">
                            Include what you tried, what happened, and any relevant details.
                        </p>


                        <textarea
                            id="body"
                            value={body}
                            onChange={handleBodyChange}
                            maxLength={10000}
                            rows={12}
                            disabled={posting}
                            placeholder="Explain your problem here..."
                            className="mt-3 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                        />


                        <div className="mt-1 text-right text-xs text-gray-400">
                            {body.length}/10000
                        </div>

                    </div>


                    {/* AI Tags */}

                    <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3">

                        <p className="text-sm font-medium text-blue-800">
                            🤖 Tags will be generated automatically
                        </p>

                        <p className="mt-1 text-xs text-blue-600">
                            DevConnect will analyze your question and generate relevant tags.
                        </p>

                    </div>


                    {/* Actions */}

                    <div className="mt-6 flex items-center justify-end gap-3">

                        <button
                            type="button"
                            disabled={posting}
                            onClick={() =>
                                navigate("/explore")
                            }
                            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                !title.trim() ||
                                !body.trim() ||
                                posting
                            }
                            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                                title.trim() &&
                                body.trim() &&
                                !posting
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "cursor-not-allowed bg-gray-300"
                            }`}
                        >
                            {posting
                                ? "Posting..."
                                : "Post Question"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AskQuestion;