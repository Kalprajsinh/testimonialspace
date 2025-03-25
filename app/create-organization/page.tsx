"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
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


  const handleFileChange = (e:any) => {
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
  

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const responce = await axios.post("http://localhost:3001/api/organization", {
        admin: user?.fullName,
        name: organame,
        logo: logo,
        title: title,
        message: message,
      });

      setSuccess("Organization created successfully!");
    } catch (err) {
      setError("Failed to create organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto flex justify-center items-center">
      <div className="bg-zinc-800 p-6 rounded-lg w-96 shadow-lg">
        <h1 className="text-lg font-bold mb-4">Create a New Organization</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm">Organization Name:</label>
          <input 
            type="text" 
            className="p-2 bg-zinc-700 rounded-md" 
            value={organame} 
            onChange={(e) => setOrganame(e.target.value)} 
            required
          />

          <label className="text-sm">Title for Collecting Testimonial:</label>
          <input 
            type="text" 
            className="p-2 bg-zinc-700 rounded-md" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
          />

          <label className="text-sm">Organization Logo:</label>
          <input 
            type="file" 
            className="p-2 bg-zinc-700 rounded-md" 
            accept="image/*" 
            onChange={handleFileChange} 
            required
          />

          <label className="text-sm">Message for Display on Collecting Page:</label>
          <input 
            type="text" 
            className="p-2 bg-zinc-700 rounded-md" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required
          />

          <button 
            type="submit" 
            className="bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}

export default NewOrganization;
