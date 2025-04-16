import axios from 'axios';
import { Heart, Star } from 'lucide-react';
import React, { useState } from 'react';

interface Testimonial {
  admin: string;
  name: string;
  email: string;
  photo: string;
  star: number;
  text: string;
  favorite: boolean;
  organizationName: String;
}

interface TestimonialCardProps {
  index: number;
  testimonial: Testimonial;
}

function Testimonialcard({ index, testimonial }: TestimonialCardProps) {

  const [fav,setfav] = useState(testimonial.favorite);

  async function favoriteTestimonial() {
    if(!fav) {
    const responce = await axios.post('https://testimonialspace.onrender.com/api/favorite', {
      admin:testimonial.admin, 
      email:testimonial.email, 
      organizationName:testimonial.organizationName
    });

    const data = responce.data;
    console.log(data);
    
    if (responce.data) {
      setfav(true);
    } else {
      console.log("error in favoriting testimonial");
    }
  }
  else{
    const responce = await axios.post('https://testimonialspace.onrender.com/api/favorite/remove', {
      admin:testimonial.admin, 
      email:testimonial.email, 
      organizationName:testimonial.organizationName
    });

    const data = responce.data;
    console.log(data);
    
    if (responce.data) {
      setfav(false);
    } else {
      console.log("error in unfavoriting testimonial");
  }
  }
}

  return (
    <div key={index} className="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold">{testimonial.name}</h4>
            <p className="text-zinc-400 text-sm">{testimonial.email}</p>
          </div>
        </div>
        <button onClick={favoriteTestimonial} className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
          {fav ? (
            <Heart className="text-pink-500 fill-pink-500 w-6 h-6" />
          ) : (
            <Heart className="text-gray-500 w-6 h-6 hover:text-pink-500 hover:fill-pink-500 transition-colors" />
          )}
        </button>
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.star)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-zinc-300 leading-relaxed">"{testimonial.text}"</p>
    </div>
  );
}

export default Testimonialcard;
