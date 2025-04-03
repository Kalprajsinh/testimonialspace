"use client"

import { 
  Star, 
  MessageSquare,
  Video,
  Heart,
  CopyIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'next/navigation'
import Testimonialcard from "./Testimonialcard";


const Dashboard = () => {
    const params = useParams<{ organame: string }>()

  const [alltestimonial, setalltestimonial] = useState([]);
  const [TotalTestimonials, setTotalTestimonials] = useState(0);
  const [avgrating, setavgrating] = useState(0);
  const [testimonialData, setTestimonialData] = useState({
    textPercentage: 0,
    videoPercentage: 0
  });
  const [ratingData, setRatingData] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    async function alltestimonial(){
      const respons = await axios.get("http://localhost:3001/api/alluser",{
        params: { admin: user?.fullName,organizationName:params.organame }
      });
      console.log(respons.data);
      setalltestimonial(respons.data);
    } 

    async function getalltestimonial() {
      const respons = await axios.get("http://localhost:3001/api/organization-Testimonials",{
        params: { admin: user?.fullName,organizationName:params.organame }
      });
      setTotalTestimonials(respons.data);
    }
    async function getavgrating() {
      const respons = await axios.get("http://localhost:3001/api/organization-avgrating",{
        params: { admin: user?.fullName,organizationName:params.organame }
      });
      // console.log(params.organame);
      if (respons.data != null) {
        setavgrating(respons.data.toFixed(2));
      }
    }

    async function fetchTestimonialTypes() {
      try {
        const response = await axios.get("http://localhost:3001/api/orga-testimonial-types", {
          params: { admin: user?.fullName,organizationName:params.organame },
        });
        const data = response.data;
        // console.log(data);
        setTestimonialData({
          textPercentage: parseFloat(data.textPercentage),
          videoPercentage: parseFloat(data.videoPercentage),
        });
      } catch (err) {
        console.error("Error fetching testimonial types:", err);
      }
    }
    async function fetchRatingDistribution() {
      try {
        const response = await axios.get("http://localhost:3001/api/orga-rating-distribution", {
          params: { admin: user?.fullName,organizationName:params.organame },
        });
        const data = response.data;
        // console.log(data);
        setRatingData(data);
      } catch (err) {
        console.error("Error fetching rating distribution:", err);
      }
    }

    getalltestimonial();
    getavgrating();
    fetchTestimonialTypes();
    fetchRatingDistribution();
    alltestimonial();

    
  }, [user?.fullName , params.organame]);

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
            <div>
        <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col">
          <h2 className="mb-4">Testimonial Types</h2>
          <div>
  
            <div>
              <div className="flex mb-2 items-center justify-between text-sm">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Text</span>
                </div>
                <span className="font-medium">{testimonialData.textPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${testimonialData.textPercentage}%` }}
                ></div>
              </div>
            </div>
  
            <div className="mt-2">
              <div className="flex mb-2 items-center justify-between text-sm">
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Video</span>
                </div>
                <span className="font-medium">{testimonialData.videoPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${testimonialData.videoPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
            </div>
  
            <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col">
          <h4 className="mb-4 text-sm font-medium">Rating Distribution</h4>
          <div className="space-y-2 grid gap-x-4">
            {ratingData.map((rating) => {
              const { star, percentage } = rating;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <div className="w-8 text-right flex gap-0.5">
                    <p>{star} </p>
                    <p>★</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8">{Math.ceil(percentage)}%</div>
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
      
      <span className="text-orange-500">http://localhost:3000/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}</span> 

        <button onClick={()=>{
          navigator.clipboard.writeText(`
            http://localhost:3000/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}
            `);
          }} 
          className="hover:text-blue-400 cursor-pointer"
        >
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
    </div>

    <div className="flex-1 rounded-lg p-6 shadow-md bg-zinc-900">
      <h3 className="mb-3 text-lg font-semibold text-white">Embed Form</h3>
      <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
      <div className="font-mono text-xs flex items-center justify-between">
        <span className="text-orange-500 overflow-x-auto mr-20">&lt;iframe src="http://localhost:3000/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}" width="100%" height="400"&gt;&lt;/iframe&gt;</span>

        <button onClick={()=>{
          navigator.clipboard.writeText(`
            <iframe src="http://localhost:3000/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}" width="100%" height="400"></iframe>
            `);
          }} 
          className="hover:text-blue-400 cursor-pointer"
        >
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
    </div>
  </div>
</div>


         <div className="mt-6 text-white">
          <h2 className="text-xl font-bold">Your Testimonials</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
              {alltestimonial.map((testimonial:any, index) => (
                <Testimonialcard key={index} index={index} testimonial={testimonial} />
              ))}
            </div>
        </div>
        </div>
    )
}

export default Dashboard;