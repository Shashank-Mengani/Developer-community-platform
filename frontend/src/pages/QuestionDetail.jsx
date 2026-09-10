import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthProvider";

const QuestionDetail = () => {

    const { questionId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    // State
    const [question, setQuestion] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [answers, setAnswers] = useState([]);

    const [answersLoading, setAnswersLoading] = useState(true);
    const [answersError, setAnswersError] = useState("");

    const [answerBody, setAnswerBody] = useState("");

    const [answerPosting, setAnswerPosting] = useState(false);
    const [answerMessage, setAnswerMessage] = useState("");

    // Question vote
    const [userVote, setUserVote] = useState(null);
    const [voteLoading, setVoteLoading] = useState(false);

    // Answer votes
    const [answerVotes, setAnswerVotes] = useState({});
    const [answerVoteLoading, setAnswerVoteLoading] = useState(null);

    // Current User
    const currentUserId =
        user?._id || user?.id;

    // Question Ownership
    const questionAuthorId =
        question?.author?._id ||
        question?.author?.id;

    const isQuestionAuthor =
        currentUserId?.toString() ===
        questionAuthorId?.toString();

    // Fetch Question + Answers + Vote Status
    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                setLoading(true);
                setAnswersLoading(true);

                setError("");
                setAnswersError("");

                // Fetch Question
                const response = await api.get(
                    `/question/${questionId}`
                );

                console.log(
                    "QUESTION:",
                    response.data
                );

                setQuestion(
                    response.data.data
                );

                // Fetch Question Vote Status
                const questionVoteResponse =
                    await api.get(
                        `/vote/Question/${questionId}`
                    );

                console.log(
                    "QUESTION VOTE STATUS:",
                    questionVoteResponse.data
                );

                setUserVote(
                    questionVoteResponse.data.data.userVote
                );

                // Fetch Answers
                const answersResponse =
                    await api.get(
                        `/answer/question/${questionId}`
                    );

                console.log(
                    "ANSWERS:",
                    answersResponse.data
                );

                const loadedAnswers =
                    answersResponse.data.data || [];

                setAnswers(
                    loadedAnswers
                );

                // Fetch Answer Vote Status
                const voteStatuses =
                    await Promise.all(
                        loadedAnswers.map(
                            async (answer) => {

                                try {
                                    const response =
                                        await api.get(
                                            `/vote/Answer/${answer._id}`
                                        );

                                    return {
                                        answerId:
                                            answer._id,

                                        userVote:
                                            response.data.data.userVote
                                    };

                                } catch (error) {
                                    console.log(
                                        "ANSWER VOTE STATUS ERROR:",
                                        error.response?.data?.message ||
                                        error.message
                                    );

                                    return {
                                        answerId: answer._id,
                                        userVote: null
                                    };
                                }
                            }
                        )
                    );

                const voteState = {};

                voteStatuses.forEach(
                    ({
                        answerId,
                        userVote
                    }) => {

                        voteState[answerId] =
                            userVote;
                    }
                );

                setAnswerVotes(
                    voteState
                );

            } catch (error) {
                console.log(
                    "QUESTION ERROR:",
                    error.response?.data?.message ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load question"
                );

                setAnswersError(
                    error.response?.data?.message ||
                    "Failed to load answers"
                );

            } finally {
                setLoading(false);
                setAnswersLoading(false);
            }
        };

        fetchQuestion();

    }, [questionId]);

    // Loading
    if (loading) {

        return (
            <div className="mx-auto max-w-4xl px-4 py-8">

                <p className="text-gray-500">
                    Loading question...
                </p>

            </div>
        );

    }

    // Error
    if (error) {

        return (
            <div className="mx-auto max-w-4xl px-4 py-8">

                <p className="text-red-500">
                    {error}
                </p>


                <button
                    onClick={() =>
                        navigate("/explore")
                    }
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                >
                    Back to Questions
                </button>

            </div>
        );

    }


    if (!question) {
        return null;
    }

    // Post Answer
    const handlePostAnswer = async (e) => {

        e.preventDefault();

        if (!answerBody.trim()) {
            return;
        }

        if (answerPosting) {
            return;
        }

        try {
            setAnswerPosting(true);
            setAnswerMessage("");

            const response = await api.post(
                `/answer/${questionId}/answers`,
                {
                    body: answerBody.trim()
                }
            );

            console.log(
                "ANSWER CREATED:",
                response.data
            );

            const newAnswer =
                response.data.data;

            setAnswers((currentAnswers) => [
                ...currentAnswers,
                newAnswer
            ]);

            setQuestion((currentQuestion) => ({
                ...currentQuestion,
                answerCount:
                    (currentQuestion.answerCount || 0) + 1
            }));

            // New answer has not been voted on
            setAnswerVotes((currentVotes) => ({
                ...currentVotes,
                [newAnswer._id]: null
            }));

            setAnswerBody("");

        } catch (error) {
            console.log(
                "ANSWER ERROR:",
                error.response?.data?.message ||
                error.message
            );

            setAnswerMessage(
                error.response?.data?.message ||
                "Failed to post answer"
            );

        } finally {
            setAnswerPosting(false);
        }

    };

    // Question Vote
    const handleQuestionVote = async (type) => {

        if (voteLoading) {
            return;
        }

        try {

            setVoteLoading(true);
            const response = await api.post(
                "/vote",
                {
                    targetId: questionId,
                    targetType: "Question",
                    type
                }
            );

            console.log(
                "QUESTION VOTE:",
                response.data
            );

            setQuestion((currentQuestion) => ({
                ...currentQuestion,
                voteCount:
                    response.data.voteCount
            }));

            setUserVote(
                response.data.userVote
            );

        } catch (error) {
            console.log(
                "QUESTION VOTE ERROR:",
                error.response?.data?.message ||
                "Failed to vote"
            );

        } finally {
            setVoteLoading(false);
        }
    };

    // Answer Vote
    const handleAnswerVote = async (
        answerId,
        type
    ) => {

        if (answerVoteLoading === answerId) {
            return;
        }

        try {
            setAnswerVoteLoading(answerId);
            const response = await api.post(
                "/vote",
                {
                    targetId: answerId,
                    targetType: "Answer",
                    type
                }
            );

            console.log(
                "ANSWER VOTE:",
                response.data
            );

            setAnswers((currentAnswers) =>
                currentAnswers.map((answer) =>
                    answer._id === answerId
                        ? {
                            ...answer,
                            voteCount:
                                response.data.voteCount
                        }
                        : answer
                )
            );

            setAnswerVotes((currentVotes) => ({
                ...currentVotes,
                [answerId]:
                    response.data.userVote
            }));

        } catch (error) {
            console.log(
                "ANSWER VOTE ERROR:",
                error.response?.data?.message ||
                "Failed to vote"
            );

        } finally {
            setAnswerVoteLoading(null);
        }

    };

    // Accept Answer
    const handleAcceptAnswer = async (
        answerId
    ) => {

        if (!isQuestionAuthor) {
            return;
        }


        try {

            const response = await api.patch(
                `/answer/${answerId}/accept`
            );

            console.log(
                "ANSWER ACCEPTED:",
                response.data
            );

            setAnswers((currentAnswers) =>
                currentAnswers.map((answer) => ({
                    ...answer,
                    isAccepted:
                        answer._id === answerId
                }))
            );

            setQuestion((currentQuestion) => ({
                ...currentQuestion,
                acceptedAnswer: answerId
            }));

        } catch (error) {

            console.log(
                "ACCEPT ANSWER ERROR:",
                error.response?.data?.message ||
                "Failed to accept answer"
            );
        }
    };

    // Delete Question
    const handleDeleteQuestion = async () => {

        if (!isQuestionAuthor) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/question/${question._id}`
            );

            navigate("/explore");

        } catch (error) {
            console.log(
                "DELETE QUESTION ERROR:",
                error.response?.data?.message ||
                "Failed to delete question"
            );
        }
    };

    // Delete Answer
    const handleDeleteAnswer = async (
        answerId
    ) => {

        const answer =
            answers.find(
                (item) =>
                    item._id === answerId
            );


        if (!answer) {
            return;
        }

        const answerAuthorId =
            answer.author?._id ||
            answer.author?.id;

        if (
            currentUserId?.toString() !==
            answerAuthorId?.toString()
        ) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this answer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/answer/${answerId}`
            );

            setAnswers((currentAnswers) =>
                currentAnswers.filter(
                    (item) =>
                        item._id !== answerId
                )
            );

            setAnswerVotes((currentVotes) => {

                const updatedVotes = {
                    ...currentVotes
                };

                delete updatedVotes[answerId];

                return updatedVotes;

            });

            setQuestion((currentQuestion) => ({
                ...currentQuestion,

                answerCount: Math.max(
                    0,
                    (currentQuestion.answerCount || 0) - 1
                ),

                acceptedAnswer:
                    currentQuestion.acceptedAnswer ===
                    answerId
                        ? null
                        : currentQuestion.acceptedAnswer
            }));

        } catch (error) {
            console.log(
                "DELETE ANSWER ERROR:",
                error.response?.data?.message ||
                "Failed to delete answer"
            );
        }
    };

    // UI
    return (
        <div className="mx-auto max-w-4xl px-4 py-8">

                {/* Back */}

            <button
                onClick={() =>
                    navigate("/explore")
                }
                className="mb-6 text-sm text-gray-500 hover:text-gray-900"
            >
                ← Back to Questions
            </button>


            {/* Question */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">


                {/* Question Header */}

                <div className="flex items-start justify-between gap-4">

                    <h1 className="text-2xl font-bold text-gray-900">
                        {question.title}
                    </h1>


                    {/* Delete */}

                    {isQuestionAuthor && (

                        <button
                            type="button"
                            onClick={handleDeleteQuestion}
                            className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Delete
                        </button>

                    )}

                </div>


                {/* Question Content */}

                <div className="mt-6 flex gap-6">


                    {/* Question Vote */}

                    <div className="flex shrink-0 flex-col items-center">

                        <button
                            onClick={() =>
                                handleQuestionVote("up")
                            }
                            disabled={voteLoading}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xl transition ${
                                userVote === "up"
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            title="Upvote"
                        >
                            ▲
                        </button>


                        <span className="py-1 text-lg font-semibold text-gray-800">
                            {question.voteCount || 0}
                        </span>


                        <button
                            onClick={() =>
                                handleQuestionVote("down")
                            }
                            disabled={voteLoading}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xl transition ${
                                userVote === "down"
                                    ? "bg-red-100 text-red-600"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            title="Downvote"
                        >
                            ▼
                        </button>

                    </div>


                    {/* Question Body */}

                    <div className="min-w-0 flex-1">

                        <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
                            {question.body}
                        </p>


                        {/* Tags */}

                        {question.tags?.length > 0 && (

                            <div className="mt-6 flex flex-wrap gap-2">

                                {question.tags.map(
                                    (tag) => (

                                        <span
                                            key={tag}
                                            className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                                        >
                                            {tag}
                                        </span>

                                    )
                                )}

                            </div>

                        )}


                        {/* Question Meta */}

                        <div className="mt-6 border-t border-gray-100 pt-4">

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">

                                <span>
                                    Asked by{" "}
                                    <span className="font-semibold text-gray-800">
                                        {question.author?.name ||
                                            question.author?.username ||
                                            "Unknown user"}
                                    </span>
                                </span>


                                <span>
                                    {question.views || 0} views
                                </span>


                                <span>
                                    {question.answerCount || 0}{" "}
                                    {question.answerCount === 1
                                        ? "answer"
                                        : "answers"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                Answers
            ========================================== */}

            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-900">

                    {answers.length}{" "}

                    {answers.length === 1
                        ? "Answer"
                        : "Answers"}

                </h2>


                {/* Loading */}

                {answersLoading && (

                    <p className="mt-4 text-sm text-gray-500">
                        Loading answers...
                    </p>

                )}


                {/* Error */}

                {answersError &&
                    !answersLoading && (

                        <p className="mt-4 text-sm text-red-500">
                            {answersError}
                        </p>

                    )}


                {/* Answer List */}

                {!answersLoading &&
                    !answersError && (

                        <div className="mt-4">

                            {answers.length === 0 ? (

                                <div className="rounded-xl border border-gray-200 bg-white p-6">

                                    <p className="text-gray-500">
                                        No answers yet.
                                    </p>

                                </div>

                            ) : (

                                answers.map(
                                    (answer) => {

                                        const answerAuthorId =
                                            answer.author?._id ||
                                            answer.author?.id;


                                        const isAnswerAuthor =
                                            currentUserId?.toString() ===
                                            answerAuthorId?.toString();


                                        return (

                                            <div
                                                key={answer._id}
                                                className={`border-b py-6 ${
                                                    answer.isAccepted
                                                        ? "border-green-300"
                                                        : "border-gray-200"
                                                }`}
                                            >


                                                {/* Accepted */}

                                                {answer.isAccepted && (

                                                    <div className="mb-3">

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                            ✓ Accepted Answer
                                                        </span>

                                                    </div>

                                                )}


                                                {/* Answer */}

                                                <div className="flex gap-6">


                                                    {/* Answer Vote */}

                                                    <div className="flex shrink-0 flex-col items-center">

                                                        <button
                                                            onClick={() =>
                                                                handleAnswerVote(
                                                                    answer._id,
                                                                    "up"
                                                                )
                                                            }
                                                            disabled={
                                                                answerVoteLoading ===
                                                                answer._id
                                                            }
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition ${
                                                                answerVotes[
                                                                    answer._id
                                                                ] === "up"
                                                                    ? "bg-blue-100 text-blue-600"
                                                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                            }`}
                                                            title="Upvote"
                                                        >
                                                            ▲
                                                        </button>


                                                        <span className="py-1 text-sm font-semibold text-gray-800">
                                                            {answer.voteCount || 0}
                                                        </span>


                                                        <button
                                                            onClick={() =>
                                                                handleAnswerVote(
                                                                    answer._id,
                                                                    "down"
                                                                )
                                                            }
                                                            disabled={
                                                                answerVoteLoading ===
                                                                answer._id
                                                            }
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition ${
                                                                answerVotes[
                                                                    answer._id
                                                                ] === "down"
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                            }`}
                                                            title="Downvote"
                                                        >
                                                            ▼
                                                        </button>

                                                    </div>


                                                    {/* Answer Content */}

                                                    <div className="min-w-0 flex-1">

                                                        <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
                                                            {answer.body}
                                                        </p>


                                                        {/* Answer Footer */}

                                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">


                                                            {/* Author */}

                                                            <div>

                                                                <p className="text-xs text-gray-500">
                                                                    Answered by
                                                                </p>

                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {answer.author?.name ||
                                                                        answer.author?.username ||
                                                                        "Unknown user"}
                                                                </p>

                                                            </div>


                                                            {/* Actions */}

                                                            <div className="flex items-center gap-3">


                                                                {/* Accept */}

                                                                {isQuestionAuthor &&
                                                                    !answer.isAccepted && (

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleAcceptAnswer(
                                                                                    answer._id
                                                                                )
                                                                            }
                                                                            className="rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-50"
                                                                        >
                                                                            ✓ Accept
                                                                        </button>

                                                                    )}


                                                                {/* Delete */}

                                                                {isAnswerAuthor && (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteAnswer(
                                                                                answer._id
                                                                            )
                                                                        }
                                                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>

                    )}

            </div>

                {/* Your Answer */}

            <div className="mt-10">

                <h2 className="text-xl font-bold text-gray-900">
                    Your Answer
                </h2>

                <form
                    onSubmit={handlePostAnswer}
                    className="mt-4"
                >

                    <textarea
                        value={answerBody}
                        onChange={(e) =>
                            setAnswerBody(
                                e.target.value
                            )
                        }
                        placeholder="Write your answer..."
                        rows={7}
                        maxLength={5000}
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="mt-2 flex items-center justify-between">

                        <span className="text-xs text-gray-400">
                            {answerBody.length}/5000
                        </span>

                        <button
                            type="submit"
                            disabled={
                                !answerBody.trim() ||
                                answerPosting
                            }
                            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                                answerBody.trim() &&
                                !answerPosting
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "cursor-not-allowed bg-gray-300"
                            }`}
                        >
                            {answerPosting
                                ? "Posting..."
                                : "Post Answer"}
                        </button>

                    </div>

                    {answerMessage && (

                        <p className="mt-3 text-sm text-red-500">
                            {answerMessage}
                        </p>

                    )}

                </form>

            </div>

        </div>
    );
};

export default QuestionDetail;