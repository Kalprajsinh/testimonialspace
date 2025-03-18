import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Heart, Star } from 'lucide-react';


function Alltestimonial() {

  const [alltestimonial, setalltestimonial] = useState([]);
  const params = useParams<{ organame: string }>()

  const { user } = useUser();

  useEffect(() => {
    async function alltestimonial(){
      const respons = await axios.get("http://localhost:3001/api/alluser",{
        params: { admin: user?.fullName,organizationName:params.organame }
      });
      console.log(respons.data);
      setalltestimonial(respons.data);
    }

    alltestimonial();

},[user?.fullName , params.organame]);

  return (
  <div className="p-8 pt-20 min-h-screen">
    <div className="mt-6 text-white">
      <h2 className="text-2xl font-extrabold border-b pb-2 border-gray-700">All Testimonials</h2>
      <div className="mt-6 space-y-6">
        {alltestimonial.map((testimonial: any, index) => (
          <div
          key={index}
            className="bg-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col space-y-4"
          >
            <div className="md:flex md:justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={`data:image/jpg;base64,${testimonial.photo}`}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.email}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(testimonial.star)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-white text-sm px-14 pt-2">{testimonial.text}</div>
              <div className='sm:flex flex-col items-end hidden'>

              <div className="flex justify-end gap-4">
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                {testimonial.favorite ? (
                  <Heart className="text-pink-500 fill-pink-500 w-6 h-6" />
                ) : (
                  <Heart className="text-gray-500 w-6 h-6 hover:text-pink-500 hover:fill-pink-500 transition-colors" />
                )}
              </button>
              <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                Edit
              </button>
              <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                Delete
              </button>
            </div>
                <p className="text-gray-300 text-xs mt-5">
                    {new Date(testimonial.createdAt).toLocaleDateString()} •{" "}
                    {new Date(testimonial.createdAt).toLocaleTimeString()}
                  </p>
              </div>
              
            </div>
            <div className='flex flex-col items-end sm:hidden'>

              <div className="flex justify-end gap-4">
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                {testimonial.favorite ? (
                  <Heart className="text-pink-500 fill-pink-500 w-6 h-6" />
                ) : (
                  <Heart className="text-gray-500 w-6 h-6 hover:text-pink-500 hover:fill-pink-500 transition-colors" />
                )}
              </button>
              <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                Edit
              </button>
              <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                Delete
              </button>
            </div>
                <p className="text-gray-300 text-xs mt-5">
                    {new Date(testimonial.createdAt).toLocaleDateString()} •{" "}
                    {new Date(testimonial.createdAt).toLocaleTimeString()}
                  </p>
              </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}

export default Alltestimonial