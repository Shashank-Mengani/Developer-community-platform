import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Explore = () => {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Tags
    useEffect(() => {

        const fetchTags = async () => {

            try {

                const response = await api.get(
                    "/question/tags"
                );

                console.log(
                    "TAGS:",
                    response.data
                );

                setTags(
                    response.data.data || []
                );

            } catch (error) {
                console.log(
                    "TAGS ERROR:",
                    error.response?.data?.message ||
                    error.message
                );
            }
        };

        fetchTags();

    }, []);

    // Fetch Questions
    useEffect(() => {

        const fetchQuestions = async () => {

            try {

                setLoading(true);
                setError("");

                let response;

                // Selected Tag
                if (selectedTag !== "all") {

                    response = await api.get(
                        `/question/tag/${encodeURIComponent(
                            selectedTag
                        )}`
                    );

                }

                // Search
                else if (search.trim()) {
                    response = await api.get(
                        "/question/search",
                        {
                            params: {
                                search:
                                    search.trim()
                            }
                        }
                    );
                }

                // Sorting
                else if (sortBy === "votes") {
                    response = await api.get(
                        "/question/votes"
                    );
                }

                else if (sortBy === "answers") {
                    response = await api.get(
                        "/question/answers"
                    );
                }

                // Default
                else {
                    response = await api.get(
                        "/question"
                    );
                }

                setQuestions(
                    response.data.data || []
                );

            } catch (error) {
                console.log(
                    "QUESTIONS ERROR:",
                    error.response?.data?.message ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load questions"
                );

            } finally {
                setLoading(false);
            }

        };

        const timer = setTimeout(
            fetchQuestions,
            search.trim() ? 400 : 0
        );

        return () => {
            clearTimeout(timer);
        };

    }, [
        search,
        sortBy,
        selectedTag
    ]);

    // Search
    const handleSearchChange = (e) => {

        setSearch(e.target.value);

        setSelectedTag("all");

    };

    // Clear Search
    const handleClearSearch = () => {

        setSearch("");

    };

    // Tag Selection
    const handleTagSelect = (tag) => {

        setSelectedTag(tag);

        setSearch("");

        setSortBy("newest");

    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="mx-auto max-w-4xl px-4 py-8">


                {/* Header */}

                <div className="mb-6 flex items-start justify-between gap-4">

                    <div>

                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        ← Back to Home
                    </button>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Explore Questions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Discover questions from the developer community.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/questions/ask")}
                        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Ask Question
                    </button>

                </div>


                {/* Search */}

                <div className="relative">

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search questions..."
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {search && (

                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-700"
                        >
                            Clear
                        </button>

                    )}

                </div>

                {/* Tags */}

                {tags.length > 0 && (

                    <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between">

                            <h2 className="text-sm font-semibold text-gray-700">
                                Browse by tag
                            </h2>

                            {selectedTag !== "all" && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleTagSelect("all")
                                    }
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Clear tag
                                </button>

                            )}

                        </div>


                        <div className="flex flex-wrap gap-2">

                            {/* All */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleTagSelect("all")
                                }
                                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                                    selectedTag === "all"
                                        ? "bg-gray-900 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                All
                            </button>


                            {/* Tags */}

                            {tags.map((tag) => (

                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() =>
                                        handleTagSelect(tag)
                                    }
                                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                                        selectedTag === tag
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {tag}
                                </button>

                            ))}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    Sort
                ========================================== */}

                <div className="mt-6 flex items-center justify-between">

                    <p className="text-sm text-gray-500">

                        {questions.length}{" "}

                        {questions.length === 1
                            ? "question"
                            : "questions"}

                    </p>


                    <select
                        value={sortBy}
                        onChange={(e) => {

                            setSortBy(
                                e.target.value
                            );

                            setSelectedTag("all");

                        }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >

                        <option value="newest">
                            Newest
                        </option>

                        <option value="votes">
                            Most Votes
                        </option>

                        <option value="answers">
                            Most Answers
                        </option>

                    </select>

                </div>


                {/* ==========================================
                    Loading
                ========================================== */}

                {loading && (

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                        <p className="text-sm text-gray-500">
                            Loading questions...
                        </p>

                    </div>

                )}


                {/* ==========================================
                    Error
                ========================================== */}

                {error && !loading && (

                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">

                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                )}


                {/* ==========================================
                    Empty
                ========================================== */}

                {!loading &&
                    !error &&
                    questions.length === 0 && (

                        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">

                            <p className="text-lg font-semibold text-gray-800">
                                No questions found
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Try another search or tag.
                            </p>

                        </div>

                    )}


                {/* ==========================================
                    Questions
                ========================================== */}

                {!loading &&
                    !error &&
                    questions.length > 0 && (

                        <div className="mt-6 space-y-4">

                            {questions.map(
                                (question) => (

                                    <article
                                        key={question._id}
                                        onClick={() =>
                                            navigate(
                                                `/questions/${question._id}`
                                            )
                                        }
                                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
                                    >

                                        {/* Stats */}

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">

                                            <span>
                                                {question.voteCount || 0} votes
                                            </span>

                                            <span>
                                                {question.answerCount || 0} answers
                                            </span>

                                            <span>
                                                {question.views || 0} views
                                            </span>

                                        </div>


                                        {/* Title */}

                                        <h2 className="mt-3 text-lg font-semibold text-gray-900 hover:text-blue-600">
                                            {question.title}
                                        </h2>


                                        {/* Body */}

                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                            {question.body}
                                        </p>


                                        {/* Footer */}

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">


                                            {/* Question Tags */}

                                            <div className="flex flex-wrap gap-2">

                                                {question.tags?.map(
                                                    (tag) => (

                                                        <span
                                                            key={tag}
                                                            className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                                                        >
                                                            {tag}
                                                        </span>

                                                    )
                                                )}

                                            </div>


                                            {/* Author */}

                                            <div className="text-xs text-gray-500">

                                                Asked by{" "}

                                                <span className="font-semibold text-gray-700">

                                                    {question.author?.name ||
                                                        question.author?.username ||
                                                        "Unknown user"}

                                                </span>

                                            </div>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </div>

        </div>
    );
};

export default Explore;