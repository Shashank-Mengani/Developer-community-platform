import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthProvider";

const QuestionDetail = () => {

    const { questionId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [answers, setAnswers] = useState([]);
    const [answersLoading, setAnswersLoading] = useState(true);
    const [answersError, setAnswersError] = useState("");

    const [answerBody, setAnswerBody] = useState("");
    const [answerPosting, setAnswerPosting] = useState(false);
    const [answerMessage, setAnswerMessage] = useState("");

    const [userVote, setUserVote] = useState(null);
    const [voteLoading, setVoteLoading] = useState(false);

    const [answerVotes, setAnswerVotes] = useState({});
    const [answerVoteLoading, setAnswerVoteLoading] = useState(null);

    const currentUserId =
        user?._id || user?.id;

    const questionAuthorId =
        question?.author?._id ||
        question?.author?.id;

    const isQuestionAuthor =
        currentUserId?.toString() ===
        questionAuthorId?.toString();


    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                setLoading(true);
                setAnswersLoading(true);

                const response = await api.get(
                    `/question/${questionId}`
                );

                setQuestion(response.data.data);

                const answersResponse = await api.get(
                    `/answer/question/${questionId}`
                );

                console.log("Answers: ", answersResponse.data);

                setAnswers(answersResponse.data.data);

            } catch (error) {

                console.log(
                    "QUESTION ERROR:",
                    error.response?.data?.message
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


    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <p className="text-gray-500">
                    Loading question...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">

                <p className="text-red-500">
                    {error}
                </p>

                <button
                    onClick={() => navigate("/explore")}
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

        // Add newly created answer immediately
        setAnswers((currentAnswers) => [
            ...currentAnswers,
            response.data.data
        ]);

        // Update answer count on question
        setQuestion((currentQuestion) => ({
            ...currentQuestion,
            answerCount: currentQuestion.answerCount + 1
        }));

        // Clear textarea
        setAnswerBody("");

    } catch (error) {

        console.log(
            "ANSWER ERROR:",
            error.response?.data?.message
        );

        setAnswerMessage(
            error.response?.data?.message ||
            "Failed to post answer"
        );

    } finally {

        setAnswerPosting(false);

    }
};

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

            setQuestion((currentQuestion) => ({
                ...currentQuestion,
                voteCount: response.data.voteCount
            }));

            setUserVote(response.data.userVote);

        } catch (error) {

            console.log(
                "VOTE ERROR:",
                error.response?.data?.message ||
                "Failed to vote"
            );

        } finally {

                setVoteLoading(false);

            }
        };

    const handleAnswerVote = async (answerId, type) => {

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

            setAnswers((currentAnswers) =>
                currentAnswers.map((answer) =>
                    answer._id === answerId
                        ? {
                            ...answer,
                            voteCount: response.data.voteCount
                        }
                        : answer
                )
            );

            setAnswerVotes((currentVotes) => ({
                ...currentVotes,
                [answerId]: response.data.userVote
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

        const handleAcceptAnswer = async (answerId) => {

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


    return (
        <div className="mx-auto max-w-4xl px-4 py-8">

            {/* Back */}

            <button
                onClick={() => navigate("/explore")}
                className="mb-6 text-sm text-gray-500 hover:text-gray-900"
            >
                ← Back to Questions
            </button>


            {/* Question */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                {/* Title */}

                <h1 className="text-2xl font-bold text-gray-900">
                    {question.title}
                </h1>


                {/* Stats */}
                <div className="mt-5 flex items-start gap-6">

                {/* Voting */}

                <div className="flex flex-col items-center">

                    <button
                        onClick={() => handleQuestionVote("up")}
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
                        {question.voteCount}
                    </span>


                    <button
                        onClick={() => handleQuestionVote("down")}
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


                {/* Question body */}

                <div className="flex-1">

                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {question.body}
                    </p>

                </div>

            </div>


                <div className="my-5 border-t border-gray-200" />


                {/* Body */}

                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {question.body}
                </p>


                {/* Tags */}

                {question.tags?.length > 0 && (

                    <div className="mt-6 flex flex-wrap gap-2">

                        {question.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            >
                                {tag}
                            </span>
                        ))}

                    </div>

                )}


                {/* Author */}

                <div className="mt-6 border-t border-gray-100 pt-4">

                    <p className="text-sm text-gray-500">
                        Asked by
                    </p>

                    <p className="font-semibold text-gray-900">
                        {question.author?.name ||
                            "Unknown user"}
                    </p>

                </div>

            </div>

            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-900">
                    {answers.length}{" "}
                    {answers.length === 1 ? "Answer" : "Answers"}
                </h2>


                {answersLoading && (
                    <p className="mt-4 text-sm text-gray-500">
                        Loading answers...
                    </p>
                )}


                {answersError && !answersLoading && (
                    <p className="mt-4 text-sm text-red-500">
                        {answersError}
                    </p>
                )}


                {!answersLoading && !answersError && (
                    <div className="mt-4">

                        {answers.length === 0 ? (

                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <p className="text-gray-500">
                                    No answers yet.
                                </p>
                            </div>

                        ) : (

                            answers.map((answer) => (

                                <div
                                    key={answer._id}
                                    className="border-b border-gray-200 py-6"
                                >

                                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                        {answer.body}
                                    </p>


                                    {/* Author */}

                                    <div className="mt-5 flex items-center justify-between">

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Answered by
                                            </p>

                                            <p className="text-sm font-semibold text-gray-900">
                                                {answer.author?.name ||
                                                    "Unknown user"}
                                            </p>
                                        </div>

                                        {isQuestionAuthor &&
                                            !answer.isAccepted && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAcceptAnswer(answer._id)
                                                    }
                                                    className="mt-4 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition"
                                                >
                                                    ✓ Accept Answer
                                                </button>

                                            )}


                                        {/* Vote count */}

                            <div className="flex flex-col items-center">

                                <button
                                    onClick={() =>
                                        handleAnswerVote(answer._id, "up")
                                    }
                                    disabled={answerVoteLoading === answer._id}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition ${
                                        answerVotes[answer._id] === "up"
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                                    title="Upvote"
                                >
                                    ▲
                                </button>


                                <span className="py-1 text-sm font-semibold text-gray-800">
                                    {answer.voteCount}
                                </span>


                                <button
                                    onClick={() =>
                                        handleAnswerVote(answer._id, "down")
                                    }
                                    disabled={answerVoteLoading === answer._id}
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition ${
                                            answerVotes[answer._id] === "down"
                                                ? "bg-red-100 text-red-600"
                                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                            title="Downvote"
                                    >
                                            ▼
                                    </button>

                                    </div>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>
                    )}

                </div>

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
                                setAnswerBody(e.target.value)
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
                                    answerBody.trim() && !answerPosting
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