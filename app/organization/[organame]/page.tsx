"use client"

import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  SettingsIcon, 
  UserIcon,
  Star, 
  MessageSquare,
  Video,
  Plus,
  Heart,
  Text,
  Code2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from 'next/navigation'

export default function BlogPost() 
{

  const params = useParams<{ organame: string }>()

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alltestimonial, setalltestimonial] = useState([]);
  const [TotalTestimonials, setTotalTestimonials] = useState(0);
  const [avgrating, setavgrating] = useState(0);
  const [testimonialData, setTestimonialData] = useState({
    textPercentage: 0,
    videoPercentage: 0
  });
  const [ratingData, setRatingData] = useState([]);

  const { user } = useUser();

    const toggleSidebar = () => {
      setSidebarOpen((prev) => !prev);
    };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {  
        setSidebarOpen(false);  
      } else {
        setSidebarOpen(true);   
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      setavgrating(respons.data);
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

  return (
    <div className="w-full h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-10"
        } h-full bg-zinc-900 pt-16 text-white transition-all duration-300 shadow-lg`}
      >
        <button 
          onClick={toggleSidebar} 
          className="w-full py-4 px-2 flex text-white rounded-lg transition-all duration-200 justify-end cursor-pointer"
        >
          {sidebarOpen ? (
            <div className="flex justify-between w-full">
              <span>{user?.fullName}</span> 
              <SidebarCloseIcon />
            </div>
          ) : (
            <SidebarOpenIcon />
          )}
        </button>

        <hr />
        <nav className="">
          <ul>
            {sidebarOpen ? (
              <>
                <Link href={'/dashboard'}>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </li>
              </Link>
              
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <MessageSquare className="w-5 h-5" />
                <span>All Testimonials</span>
                </li>
        
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Text className="w-5 h-5" />
                <span>Text Testimonials</span>
                </li>
             
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Video className="w-5 h-5" />
                <span>Video Testimonials</span>
                </li>
             
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Heart className="w-5 h-5" />
                <span>Favorite Testimonials</span>
                </li>

                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Code2 className="w-5 h-5" />
                <span>Embed Code</span>
                </li>
             
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <UserIcon className="w-5 h-5" />
                  <span>Profile</span>
                </li>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <SettingsIcon className="w-5 h-5" />
                  <span>Settings</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <HomeIcon className="w-6 h-6" />
                </li>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <UserIcon className="w-6 h-6" />
                </li>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <SettingsIcon className="w-6 h-6" />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
{/* ////////////////////////////////////// */}
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
       <div className="mt-6 text-white">
        <h2 className="text-xl font-bold">Your Testimonials</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
            {alltestimonial.map((testimonial:any, index) => (
              <div key={index} className="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col">
                <div className="flex justify-between">
                  <div className="flex items-center gap-4 mb-6">
                    <img  
                      src={`data:image/png;base64,${testimonial.photo}`} 
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
            ))}
          </div>
      </div>
      </div>
      
    </div>
  )
}



// const params = useParams();
//       const query = new URLSearchParams(window.location.search);
//       const testimonialType = query.get('testimonial');

//       let mainContent;

//       switch (testimonialType) {
//         case 'all':
//           mainContent = (
//             <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
              
//             </div>
//           );
//           break;
//         case 'text':
//           mainContent = (
//             <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
              
//             </div>
//           );
//           break;
//         case 'video':
//           mainContent = (
//             <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
              
//             </div>
//           );
//           break;
//         case 'fevrate':
//           mainContent = (
//             <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
              
//             </div>
//           );
//           break;
//         default:
//           mainContent = (
//             <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
//               <h2 className="text-xl font-bold">Please select a valid testimonial type</h2>
//             </div>
//           );
//       }

// return mainContent;