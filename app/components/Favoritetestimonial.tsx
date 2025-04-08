import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

function Favoritetestimonial() {
  const [alltestimonial, setalltestimonial] = useState<Testimonial[]>([]);
    const params = useParams<{ organame: string }>()
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
  
    useEffect(() => {
      async function alltestimonial(){
        const respons = await axios.get("http://localhost:3001/api/favorite",{
          params: { admin: user?.fullName,organizationName:params.organame }
        });
        console.log(respons.data);
        setalltestimonial(respons.data);
        setLoading(false);
      }
  
      alltestimonial();
  
  },[user?.fullName , params.organame]);

  const handleDelete = (email: string) => {
    setalltestimonial(prev =>
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
    <div className="p-8 pt-20">
      <div className="mt-6 text-white">
        <h2 className="text-2xl font-bold border-b pb-2 border-gray-700">Favorite Testimonials</h2>
    <div className="mt-6 space-y-6">
            {alltestimonial.map((testimonial: any, index) => (
              <Testimonialhorizontal index={index} key={index} testimonial={testimonial} onDelete={handleDelete}/>
            ))}
          </div>
      </div>
    </div>
  );
  
}

function Favoritetestimonialtwo() {
  const [alltestimonial, setalltestimonial] = useState<Testimonial[]>([]);
    const params = useParams<{ organame: string }>()
  
    const { user } = useUser();
  
    useEffect(() => {
      async function alltestimonial(){
        const respons = await axios.get("http://localhost:3001/api/favorite",{
          params: { admin: user?.fullName,organizationName:params.organame }
        });
        console.log(respons.data);
        setalltestimonial(respons.data);
      }
  
      alltestimonial();
  
  },[user?.fullName , params.organame]);

  if(alltestimonial.length === 0) return null; // Return null if no testimonials are available

  const handleDelete = (email: string) => {
    setalltestimonial(prev =>
      prev.filter(testimonial => testimonial.email !== email)
    );
  };
  
    return (
    <div>
      <div className="mt-6 text-white">
        <h2 className="text-2xl font-bold">Favorite Testimonials</h2>
        <hr className="text-white mt-2" />
    <div className="mt-6 space-y-6">
            {alltestimonial.map((testimonial: any, index) => (
              <Testimonialhorizontal index={index} key={index} testimonial={testimonial} onDelete={handleDelete}/>
            ))}
          </div>
      </div>
    </div>
  );
  
}

export default Favoritetestimonial;
export { Favoritetestimonialtwo };