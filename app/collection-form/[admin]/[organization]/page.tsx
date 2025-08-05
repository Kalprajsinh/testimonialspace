"use client";

export const runtime = "edge";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Star } from "lucide-react";
import Image from 'next/image';

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
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(0);
  const [photo, setPhoto] = useState<File | null>(null);

  const admin = decodeURIComponent(params.admin);
  const organization = decodeURIComponent(params.organization);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://testimonialspace-63bp.vercel.app/api/organization", {
        params: { admin: admin, name: organization }
      });
      setOrganization(response.data);
    }
    fetchData();
  }, [admin, organization]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("https://testimonialspace-63bp.vercel.app/api/addtextuser", {
        admin,
        name,
        email,
        photo: photo ? await fileToBase64(photo) : '',
        text: reviewText,
        star: starRating,
        organizationName: Organization?.name,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setName('');
      setEmail('');
      setReviewText('');
      setStarRating(0);
      setPhoto(null);

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!Organization) return <div className="pt-20 text-center text-gray-700">Loading...</div>;

  const logoSrc = `data:image/jpeg;base64,${Organization.logo}`;

  return (
    <div className="min-h-screen bg-white pt-24 px-4">
      <div className=" max-w-2xl mx-auto bg-white border border-gray-200 p-6 rounded-xl shadow-md">
      <div className="max-w-xl mx-auto text-center">
        <Image src={logoSrc} alt="Organization Logo" width={5}
                  height={5} className="mx-auto w-24 h-24 object-cover rounded-full" />
        <h1 className="text-3xl font-bold mt-4 text-gray-900">{Organization.title}</h1>
        <p className="text-gray-600 mt-2">{Organization.message}</p>
      </div>

      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 shadow-lg">
          ✅ Your review was sent successfully!
        </div>
      )}
      
        <h2 className=" mt-10 text-xl font-semibold text-gray-800 text-center mb-6">Leave a Review</h2>

        <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Your Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:border-gray-300 file:text-sm file:bg-gray-50 hover:file:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  className={`w-6 h-6 cursor-pointer ${
                    starRating >= num ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setStarRating(num)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">{starRating} / 5</span>
            </div>
          </div>

          <textarea
            placeholder="Your review message"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          <button
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            type="submit"
          >
            Submit Review
          </button>
        </div>
          </form>
      </div>
    </div>
  );
}

export default Collectionform;
