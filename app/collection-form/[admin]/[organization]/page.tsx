"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface OrganizationData {
  _id: string;
  admin: string;
  name: string;
  logo: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

function Collectionform() {
  const params = useParams<{ admin: string; organization: string }>();
  const [Organization, setOrganization] = useState<OrganizationData | null>(null);
  const [showTextReviewPopup, setShowTextReviewPopup] = useState(false);
  const [showVideoReviewPopup, setShowVideoReviewPopup] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [starRating, setStarRating] = useState(0);
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [favorite, setFavorite] = useState(false);

  const admin = decodeURIComponent(params.admin);
  const organization = decodeURIComponent(params.organization);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/api/organization", {
        params: { admin: admin, name: organization }
      });

      console.log(response.data);
      setOrganization(response.data);
    }

    fetchData();
  }, [admin, organization]);

  if (!Organization) return <div className="pt-20 text-center">Loading...</div>;

  const logoSrc = `data:image/jpeg;base64,${Organization.logo}`;

  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission for text review
  const handleTextReviewSubmit = async () => {
    try {
      const base64Text = btoa(reviewText); // Convert text to Base64

      // Create the request payload with Base64 text
      const response = await axios.post("http://localhost:3001/api/addtextuser", {
        admin,
        name,
        email,
        photo: photo ? await fileToBase64(photo) : '',
        text: base64Text,
        star: starRating,
        organizationName: Organization.name,
        favorite
      });
      console.log('Text review submitted:', response.data);
      setShowTextReviewPopup(false); // Close the popup after submission
    } catch (error) {
      console.error("Error submitting text review:", error);
    }
  };

  // Handle form submission for video review
  const handleVideoReviewSubmit = async () => {
    try {
      if (videoFile) {
        const base64Video = await fileToBase64(videoFile); // Convert video to Base64

        // Create the request payload with Base64 video
        const response = await axios.post("http://localhost:3001/api/addvideouser", {
          admin,
          name,
          email,
          photo: photo ? await fileToBase64(photo) : '',
          video: base64Video,
          star: starRating,
          organizationName: Organization.name,
          favorite
        });
        console.log('Video review submitted:', response.data);
        setShowVideoReviewPopup(false); // Close the popup after submission
      }
    } catch (error) {
      console.error("Error submitting video review:", error);
    }
  };

  return (
    <div className="pt-20 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold">{Organization.title}</h1>
      <p className="mt-2 text-gray-700">{Organization.message}</p>

      <img src={logoSrc} alt="Organization Logo" className="mt-4 mx-auto w-40 h-40 object-cover rounded-lg" />

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setShowTextReviewPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Text Review
        </button>
        <button
          onClick={() => setShowVideoReviewPopup(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Video Review
        </button>
      </div>

      {/* Text Review Popup */}
      {showTextReviewPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold">Submit Text Review</h2>
            <input
              type="text"
              placeholder="Your Name"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="file"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            />
            <textarea
              placeholder="Write your review here..."
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="mt-4">
              <input
                type="number"
                max={5}
                min={1}
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded"
                placeholder="Rating (1-5)"
              />
            </div>
            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={() => setFavorite(!favorite)}
                />
                Favorite
              </label>
            </div>
            <div className="mt-4">
              <button
                onClick={handleTextReviewSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowTextReviewPopup(false)}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Review Popup */}
      {showVideoReviewPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold">Submit Video Review</h2>
            <input
              type="text"
              placeholder="Your Name"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="file"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            />
            <input
              type="file"
              accept="video/*"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
            />
            <div className="mt-4">
              <input
                type="number"
                max={5}
                min={1}
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded"
                placeholder="Rating (1-5)"
              />
            </div>
            <div className="mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={() => setFavorite(!favorite)}
                />
                Favorite
              </label>
            </div>
            <div className="mt-4">
              <button
                onClick={handleVideoReviewSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowVideoReviewPopup(false)}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collectionform;
