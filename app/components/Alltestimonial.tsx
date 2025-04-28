import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import Testimonialhorizontal from './Testimonialhorizontal';

interface Testimonial {
  admin: string;
  name: string;
  email: string;
  photo: string;
  star: number;
  text: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  organizationName: string;
}

function Alltestimonial() {
  const [alltestimonial, setAlltestimonial] = useState<Testimonial[]>([]);
  const params = useParams<{ organame: string }>();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAllTestimonials() {
      try {
        const response = await axios.get("https://testimonialspace-63bp.vercel.app/api/alluser",{
          params: {
            admin: user?.fullName,
            organizationName: decodeURIComponent(params.organame),
          },
        });
        setAlltestimonial(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
      finally {
        setLoading(false);
      }
    }

    if (user?.fullName && params.organame) {
      fetchAllTestimonials();
    }
  }, [user?.fullName, params.organame]);

  const handleDelete = (email: string) => {
    setAlltestimonial(prev =>
      prev.filter(testimonial => testimonial.email !== email)
    );
  };

  if (loading) 
    return (
    <div className="p-8 pt-20 min-h-screen">
      <div className="mt-6 text-white">
        <h2 className="text-2xl font-bold border-b pb-2 border-gray-700">All Testimonials</h2>
        <div className="w-full flex items-center justify-center mt-32 bg-zinc-950 text-white">
    <div className="flex flex-col items-center">
    <svg width={50} height={50} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width="100%" height="100%" fill="#000000" />
    <g>
      <linearGradient id="linear-gradient">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#787988" />
      </linearGradient>
      <path
        d="M63.85 0A63.85 63.85 0 1 1 0 63.85 63.85 63.85 0 0 1 63.85 0zm.65 19.5a44 44 0 1 1-44 44 44 44 0 0 1 44-44z"
        fill="url(#linear-gradient)"
        fillRule="evenodd"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 64 64"
        to="360 64 64"
        dur="1080ms"
        repeatCount="indefinite"
      />
    </g>
  </svg>
      <p className="text-lg font-medium mt-3">Loading Testimonials...</p>
    </div>
  </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 pt-20 min-h-screen">
      <div className="mt-6 text-white">
        <h2 className="text-2xl font-bold border-b pb-2 border-gray-700">All Testimonials</h2>
        <div className="mt-6 space-y-6">
          {alltestimonial.map((testimonial: Testimonial, index) => (
            <Testimonialhorizontal
              key={index}
              index={index}
              testimonial={testimonial}
              onDelete={handleDelete} // ✅ Pass it here
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Alltestimonial;
