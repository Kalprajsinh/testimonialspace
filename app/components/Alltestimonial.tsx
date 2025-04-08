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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllTestimonials() {
      try {
        const response = await axios.get("http://localhost:3001/api/alluser",{
          params: {
            admin: user?.fullName,
            organizationName: params.organame,
          },
        });
        setAlltestimonial(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
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
        <div className="pt-20 text-center text-white">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="p-8 pt-20 min-h-screen">
      <div className="mt-6 text-white">
        <h2 className="text-2xl font-bold border-b pb-2 border-gray-700">All Testimonials</h2>
        <div className="mt-6 space-y-6">
          {alltestimonial.map((testimonial: any, index) => (
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
