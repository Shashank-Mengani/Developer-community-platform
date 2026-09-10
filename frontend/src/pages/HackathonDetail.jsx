import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const HackathonDetail = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/hackathon/${hackathonId}`,
          {
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch hackathon"
          );
        }

        setHackathon(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

  // Register for hackathon
  const handleRegister = async () => {
    try {
      setRegistering(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/hackathon/${hackathonId}/register`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to register"
        );
      }

      setHackathon((previous) => ({
        ...previous,
        isRegistered: true,
        participantsCount: result.data.participantsCount,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setRegistering(false);
    }
  };

  // Unregister from hackathon
  const handleUnregister = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to unregister from this hackathon?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRegistering(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/hackathon/${hackathonId}/unregister`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to unregister"
        );
      }

      setHackathon((previous) => ({
        ...previous,
        isRegistered: false,
        participantsCount: result.data.participantsCount,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading hackathon...
      </div>
    );
  }

  if (error && !hackathon) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/hackathon")}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Hackathons
        </button>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="p-8 text-center text-gray-500">
        Hackathon not found.
      </div>
    );
  }

  const registrationClosed =
    new Date() > new Date(hackathon.registrationDeadline);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/hackathon")}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Hackathons
        </button>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Image */}
        <img
          src={hackathon.imageUrl}
          alt={hackathon.title}
          className="h-72 w-full rounded-xl object-cover"
        />

        {/* Main Content */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {hackathon.title}
          </h1>

          {/* Organizer */}
          <p className="mt-2 text-sm text-gray-500">
            Organized by {hackathon.author?.name}
          </p>

          {/* Basic Information */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Start Date */}
            <div>
              <p className="text-sm text-gray-500">
                Start Date
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  hackathon.startDate
                ).toLocaleString()}
              </p>
            </div>

            {/* End Date */}
            <div>
              <p className="text-sm text-gray-500">
                End Date
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  hackathon.endDate
                ).toLocaleString()}
              </p>
            </div>

            {/* Mode */}
            <div>
              <p className="text-sm text-gray-500">
                Mode
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-900">
                {hackathon.mode}
              </p>
            </div>

          </div>

          {/* Registration + Participants */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {/* Registration Deadline */}
            <div>
              <p className="text-sm text-gray-500">
                Registration Deadline
              </p>

              <p
                className={`mt-1 font-semibold ${
                  registrationClosed
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {new Date(
                  hackathon.registrationDeadline
                ).toLocaleString()}
              </p>

              {registrationClosed && (
                <p className="mt-1 text-sm text-red-500">
                  Registration is closed.
                </p>
              )}
            </div>

            {/* Participants */}
            <div>
              <p className="text-sm text-gray-500">
                Participants
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {hackathon.participantsCount} participants
              </p>
            </div>

          </div>

          {/* Prizes */}
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Prizes
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {hackathon.prizes}
            </p>
          </div>

          {/* Time Remaining */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Time remaining
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {hackathon.daysLeft === 0
                ? "Hackathon ended"
                : `${hackathon.daysLeft} days`}
            </p>
          </div>

          {/* Registration Button */}
          {registrationClosed ? (
            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-lg bg-gray-400 px-5 py-3 font-semibold text-white"
            >
              Registration Closed
            </button>
          ) : (
            <button
              type="button"
              onClick={
                hackathon.isRegistered
                  ? handleUnregister
                  : handleRegister
              }
              disabled={registering}
              className={`mt-6 w-full rounded-lg px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                hackathon.isRegistered
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {registering
                ? "Please wait..."
                : hackathon.isRegistered
                  ? "Unregister"
                  : "Register Now"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;