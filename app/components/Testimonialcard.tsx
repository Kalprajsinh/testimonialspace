import { Heart, Star } from 'lucide-react';
import React from 'react';

interface Testimonial {
  name: string;
  email: string;
  photo: string;
  star: number;
  text: string;
  favorite: boolean;
}

interface TestimonialCardProps {
  index: number;
  testimonial: Testimonial;
}

function Testimonialcard({ index, testimonial }: TestimonialCardProps) {
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
        <div className="mt-4">
          {testimonial.favorite ? (
            <Heart className="text-pink-500 fill-pink-500 w-6 h-6" />
          ) : (
            <Heart className="text-pink-500 w-6 h-6" />
          )}
        </div>
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
