import { Heart, Star } from 'lucide-react'
import React from 'react'

interface Testimonial {
    name: string;
    email: string;
    photo: string;
    star: number;
    text: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface TestimonialCardProps {
    index: number;
    testimonial: Testimonial;
  }

function Testimonialhorizontal({ index, testimonial }: TestimonialCardProps) {
  return (
    <div
          key={index}
            className="bg-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col space-y-4"
          >
            <div className="md:flex md:justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.photo}
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
                Delete
              </button>
            </div>
                <p className="text-gray-300 text-xs mt-5">
                    {new Date(testimonial.createdAt).toLocaleDateString()} •{" "}
                    {new Date(testimonial.createdAt).toLocaleTimeString()}
                  </p>
              </div>
          </div>
  )
}

export default Testimonialhorizontal