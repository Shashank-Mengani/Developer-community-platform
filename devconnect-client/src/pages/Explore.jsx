import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Explore = () => {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchQuestions = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/question");

                console.log(
                    "QUESTIONS:",
                    response.data
                );

                setQuestions(response.data.data || []);

            } catch (error) {

                console.log(
                    "QUESTIONS ERROR:",
                    error.response?.data?.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load questions"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchQuestions();

    }, []);


    return (
        <div className="min-h-screen bg-gray-100">

            <div className="mx-auto max-w-3xl px-4 py-8">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Questions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Explore questions from the developer community.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/questions/ask")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        Ask Question
                    </button>

                </div>


                {/* Loading */}

                {loading && (
                    <div className="py-10 text-center">
                        <p className="text-sm text-gray-500">
                            Loading questions...
                        </p>
                    </div>
                )}


                {/* Error */}

                {error && !loading && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* Questions */}

                {!loading && !error && (
                    <div className="mt-6 space-y-3">

                        {questions.length > 0 ? (

                            questions.map((question) => (

                                <article
                                    key={question._id}
                                    onClick={() =>
                                        navigate(
                                            `/questions/${question._id}`
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
                                >

                                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                        {question.title}
                                    </h2>


                                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                        {question.body}
                                    </p>


                                    {/* Tags */}

                                    {question.tags?.length > 0 && (

                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {question.tags.map((tag) => (

                                                <span
                                                    key={tag}
                                                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                                                >
                                                    {tag}
                                                </span>

                                            ))}

                                        </div>

                                    )}


                                    {/* Stats */}

                                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">

                                        <span>
                                            {question.voteCount} votes
                                        </span>

                                        <span>
                                            {question.answerCount} answers
                                        </span>

                                        <span>
                                            {question.views} views
                                        </span>

                                    </div>

                                </article>

                            ))

                        ) : (

                            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

                                <p className="font-medium text-gray-700">
                                    No questions yet
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    Be the first to ask a question.
                                </p>

                            </div>

                        )}

                    </div>
                )}

            </div>

        </div>
    );
};

export default Explore;