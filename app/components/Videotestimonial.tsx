import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Heart, Star } from 'lucide-react';
import Testimonialhorizontal from './Testimonialhorizontal';

function Videotestimonial() {
    const [alltestimonial, setalltestimonial] = useState([]);
    const params = useParams<{ organame: string }>()
  
    const { user } = useUser();
  
    useEffect(() => {
      async function alltestimonial(){
        const respons = await axios.get("http://localhost:3001/api/videouser",{
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
        <h2 className="text-2xl font-bold border-b pb-2 border-gray-700">Video Testimonials</h2>
    <div className="mt-6 space-y-6">
            {alltestimonial.map((testimonial: any, index) => (
              <Testimonialhorizontal index={index} key={index} testimonial={testimonial} />
            ))}
          </div>
      </div>
    </div>
    );
}

export default Videotestimonial