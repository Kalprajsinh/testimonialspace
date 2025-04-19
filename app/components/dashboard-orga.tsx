"use client";

export const runtime = "edge";

import { 
  Star, 
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'next/navigation'
import Testimonialcard from "./Testimonialcard";

interface Rating {
  star: number;
  percentage: number;
}

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

const Dashboard = () => {
    const params = useParams<{ organame: string }>()

  const [alltestimonial, setalltestimonial] = useState<Testimonial[]>([]);
  const [TotalTestimonials, setTotalTestimonials] = useState<number>(0);
  const [avgrating, setavgrating] = useState<number>(0);
  const [ratingData, setRatingData] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCheck1, setShowCheck1] = useState<boolean>(false);
  const [showCheck2, setShowCheck2] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
      async function alltestimonial(){
        const respons = await axios.get("https://testimonialspace-63bp.vercel.app/api/alluser",{
        params: { admin: user?.fullName, organizationName: decodeURIComponent(params.organame) }
      });
      console.log(respons.data);
      setalltestimonial(respons.data);
    } 
    
    async function getalltestimonial() {
      const respons = await axios.get("https://testimonialspace-63bp.vercel.app/api/organization-Testimonials",{
        params: { admin: user?.fullName, organizationName: decodeURIComponent(params.organame) }
      });
      setTotalTestimonials(respons.data);
    }
    async function getavgrating() {
      const respons = await axios.get("https://testimonialspace-63bp.vercel.app/api/organization-avgrating",{
        params: { admin: user?.fullName, organizationName: decodeURIComponent(params.organame) }
      });
      // console.log(params.organame);
      if (respons.data != null) {
        setavgrating(respons.data.toFixed(2));
      }
    }
    
    async function fetchRatingDistribution() {
      try {
        const response = await axios.get("https://testimonialspace-63bp.vercel.app/api/orga-rating-distribution", {
          params: { admin: user?.fullName, organizationName: decodeURIComponent(params.organame) },
        });
        const data = response.data;
        // console.log(data);
        setRatingData(data);
      } catch (err) {
        console.error("Error fetching rating distribution:", err);
      }
    }
    
    async function fetchData() {
      try {
        setLoading(true); 
  
        await Promise.all([
          alltestimonial(),
          getalltestimonial(),
          getavgrating(),
          fetchRatingDistribution(),
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); 
      }
    }
  
    fetchData();
  }, [user?.fullName , params.organame]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-zinc-950 text-white">
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
        <p className="text-lg font-medium mt-3">Loading Dashboard...</p>
      </div>
    </div>
      );
  }

    return(
        <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col">
              <h2 className="">Total Testimonials</h2>
              <div className="text-2xl font-bold">{TotalTestimonials}</div>
            </div>
            <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col">
              <h2 className="">Avg. Rating</h2>
              <div className="flex items-center text-2xl font-bold">
                      {avgrating}
                      <div className="ml-2 flex items-center">
                        {Array(Math.ceil(avgrating))
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : i === 4 ? "fill-primary/80 text-primary" : "text-muted"}`}
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on {TotalTestimonials} testimonials</p>
            </div>
            
         <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col col-span-2">
          <h4 className="mb-4 text-sm font-medium">Rating Distribution</h4>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[1, 2, 3].map((star) => {
              const rating = ratingData.find((r) => r.star === star);
              const percentage = rating ? rating.percentage : 0;

              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <div className="w-8 text-right flex gap-0.5">
                    <p>{star}</p>
                    <p>★</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right">{Math.ceil(percentage)}%</div>
                </div>
              );
            })}

            {[4, 5].map((star) => {
              const rating = ratingData.find((r) => r.star === star);
              const percentage = rating ? rating.percentage : 0;

              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <div className="w-8 text-right flex gap-0.5">
                    <p>{star}</p>
                    <p>★</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right">{Math.ceil(percentage)}%</div>
                </div>
              );
            })}
          </div>
        </div>
         </div>

         <div className="mt-6">
  <div className="mb-6">
    <h2 className="text-xl font-bold text-white">Collection Form</h2>
    <p className="text-sm text-gray-300">Share this form with your customers to collect testimonials.</p>
  </div>
  <div className="flex flex-col gap-6 sm:flex-row">
    <div className="flex-1 rounded-lg p-6 shadow-md bg-zinc-900">
      <h3 className="mb-3 text-lg font-semibold text-white">Collection Link</h3>
      <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
      <div className="font-mono text-sm flex items-center justify-between">
      
      <span className="text-orange-500">https://testimonialspace.vercel.app/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}</span> 

        <button onClick={()=>{
          setShowCheck1(true);
          setTimeout(() => {
            setShowCheck1(false);
          }, 1000);
          navigator.clipboard.writeText(`
            https://testimonialspace.vercel.app/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}
            `);
          }} 
          className="hover:text-blue-400 cursor-pointer"
        >
            <CopyIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck1 ? 'hidden' : 'block'}`} />
            <CheckIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck1 ? 'block' : 'hidden'}`} />

        </button>
      </div>
    </div>
    </div>

    <div className="flex-1 rounded-lg p-6 shadow-md bg-zinc-900">
      <h3 className="mb-3 text-lg font-semibold text-white">Embed Form</h3>
      <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
      <div className="font-mono text-xs flex items-center justify-between">
        <span className="text-orange-500 overflow-x-auto mr-20">&lt;iframe src=&quot;https://testimonialspace.vercel.app/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}&quot; width=&quot;100%&quot; height=&quot;400&quot;&gt;&lt;/iframe&gt;</span>

        <button onClick={()=>{
          setShowCheck2(true);
          setTimeout(() => {
            setShowCheck2(false);
          }, 1000);
          navigator.clipboard.writeText(`
            <iframe src="https://testimonialspace.vercel.app/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}" width="100%" height="400"></iframe>
            `);
          }} 
          className="hover:text-blue-400 cursor-pointer"
        >
            <CopyIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck2 ? 'hidden' : 'block'}`} />
            <CheckIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck2 ? 'block' : 'hidden'}`} />
        
        </button>
      </div>
    </div>
    </div>
  </div>
</div>


         <div className="mt-6 text-white">
          <h2 className="text-xl font-bold">Your Testimonials</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
              {alltestimonial.map((testimonial: Testimonial, index) => (
                <Testimonialcard key={index} index={index} testimonial={testimonial} />
              ))}
            </div>
        </div>
        </div>
    )
}

export default Dashboard;