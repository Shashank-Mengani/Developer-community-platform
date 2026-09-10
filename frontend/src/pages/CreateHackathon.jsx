import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateHackathon = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    prizes: "",
    mode: "online",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (
        !formData.title.trim() ||
        !formData.imageUrl.trim() ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.registrationDeadline ||
        !formData.prizes.trim()
      ) {
        setError("Please fill in all fields.");
        return;
      }

      if (
        new Date(formData.endDate) <= new Date(formData.startDate)
      ) {
        setError("End date must be after start date.");
        return;
      }

      if (
        new Date(formData.registrationDeadline) >
        new Date(formData.startDate)
        ) {
        setError(
            "Registration deadline must be before the hackathon starts."
        );
        return;
        }

      const response = await fetch(
        "http://localhost:3000/hackathon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: formData.title.trim(),
            imageUrl: formData.imageUrl.trim(),
            startDate: formData.startDate,
            endDate: formData.endDate,
            registrationDeadline: formData.registrationDeadline,
            prizes: formData.prizes.trim(),
            mode: formData.mode,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create hackathon"
        );
      }

      navigate(`/hackathons/${result.data._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/hackathon")}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Hackathons
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Hackathon
          </h1>

          <p className="mt-2 text-gray-500">
            Create a hackathon and share it with the DevConnect
            community.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-5">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Hackathon Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. DevConnect Build Challenge"
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Image URL */}
          <div className="mb-5">
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/hackathon.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Dates */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="mb-5">
            <label
                htmlFor="registrationDeadline"
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                Registration Deadline
            </label>

            <input
                id="registrationDeadline"
                name="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
            </div>

          {/* Prizes */}
          <div className="mb-5">
            <label
              htmlFor="prizes"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Prizes
            </label>

            <input
              id="prizes"
              name="prizes"
              type="text"
              value={formData.prizes}
              onChange={handleChange}
              placeholder="e.g. ₹50,000 + internship opportunities"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Mode */}
          <div className="mb-8">
            <label
              htmlFor="mode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mode
            </label>

            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => navigate("/hackathon")}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Hackathon"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;