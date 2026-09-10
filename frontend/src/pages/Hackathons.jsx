import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Hackathons = () => {
  const [search, setSearch] = useState("");
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        setError("");

        const url = search.trim()
          ? `http://localhost:3000/hackathon/search?search=${encodeURIComponent(
              search.trim()
            )}`
          : "http://localhost:3000/hackathon";

        const response = await fetch(url, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch hackathons"
          );
        }

        setHackathons(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [search]);

  // Determine hackathon status
  const getHackathonStatus = (hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);

    if (now < startDate) {
      return "upcoming";
    }

    if (now >= startDate && now < endDate) {
      return "ongoing";
    }

    return "completed";
  };

  // Filter hackathons based on selected status
  const filteredHackathons = hackathons.filter((hackathon) => {
    if (statusFilter === "all") {
      return true;
    }

    return getHackathonStatus(hackathon) === statusFilter;
  });

  // Delete hackathon
  const handleDelete = async (hackathonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hackathon?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(hackathonId);
      setError("");

      const response = await fetch(
        `http://localhost:3000/hackathon/${hackathonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete hackathon"
        );
      }

      // Remove deleted hackathon from current state
      setHackathons((previousHackathons) =>
        previousHackathons.filter(
          (hackathon) => hackathon._id !== hackathonId
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hackathons
            </h1>

            <p className="mt-2 text-gray-500">
              Discover hackathons and build something amazing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/hackathons/create")}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create Hackathon
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hackathons..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("upcoming")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("ongoing")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === "ongoing"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ongoing
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">
            Loading hackathons...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        {/* Hackathons */}
        {!loading && !error && (
          <>
            {filteredHackathons.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredHackathons.map((hackathon) => {
                  const status = getHackathonStatus(hackathon);

                  const isOwner =
                    user?._id === hackathon.author?._id;

                  return (
                    <div
                      key={hackathon._id}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* Image / clickable area */}
                      <div
                        onClick={() =>
                          navigate(
                            `/hackathons/${hackathon._id}`
                          )
                        }
                        className="cursor-pointer"
                      >
                        <img
                          src={hackathon.imageUrl}
                          alt={hackathon.title}
                          className="h-48 w-full object-cover"
                        />

                        <div className="p-5">

                          {/* Title */}
                          <h2 className="text-xl font-semibold text-gray-900">
                            {hackathon.title}
                          </h2>

                          {/* Author */}
                          <p className="mt-2 text-sm text-gray-500">
                            Organized by{" "}
                            {hackathon.author?.name}
                          </p>

                          {/* Status */}
                          <div className="mt-4">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                              {status}
                            </span>
                          </div>

                          {/* Mode + Days */}
                          <div className="mt-4 flex justify-between text-sm">
                            <span className="capitalize">
                              {hackathon.mode}
                            </span>

                            <span>
                              {hackathon.daysLeft} days left
                            </span>
                          </div>

                          {/* Prize */}
                          <p className="mt-3 font-medium">
                            Prizes: {hackathon.prizes}
                          </p>

                        </div>
                      </div>

                      {/* Delete */}
                      {isOwner && (
                        <div className="border-t border-gray-100 px-5 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(hackathon._id)
                            }
                            disabled={
                              deletingId === hackathon._id
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === hackathon._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                No{" "}
                {statusFilter === "all"
                  ? ""
                  : statusFilter}{" "}
                hackathons found.
              </p>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Hackathons;