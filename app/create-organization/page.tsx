"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function NewOrganization() {
  const { user } = useUser();

  const [organame, setOrganame] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogo(reader.result.split(",")[1]); // Extract base64 string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const responce = await axios.post("http://localhost:3001/api/organization", {
        admin: user?.fullName,
        name: organame.trim(),
        logo: logo,
        title: title,
        message: message,
      });

      setSuccess("Organization created successfully!");
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 1500);
    } catch (err) {
      setError("Failed to create organization.");
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 pt-24 px-4 text-white">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold mt-4 text-white">Create a New Organization</h1>
          <br />
        </div>

        {success && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-green-600 text-white border border-green-500 shadow-lg">
            ✅ Your Organization created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name:</label>
            <input
              type="text"
              placeholder="Enter Organization name"
              value={organame}
              onChange={(e) => setOrganame(e.target.value)}
              className="w-full p-3 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            />
            <label className="block text-sm font-medium text-gray-300 mb-1">Title for Collecting Testimonial:</label>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upload Your Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:border-zinc-600 file:bg-zinc-700 file:text-gray-300 hover:file:bg-zinc-600"
                required
              />
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-1">Message for Display on Collecting Page:</label>
            <textarea
              placeholder="Your review message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 border border-zinc-600 rounded-lg bg-zinc-700 text-white"
              required
            />

            <button
              className="w-full bg-zinc-600 cursor-pointer hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg"
              type="submit"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewOrganization;