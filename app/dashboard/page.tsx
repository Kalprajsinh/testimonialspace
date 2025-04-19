"use client";

export const runtime = "edge";

import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  UsersIcon, 
  SettingsIcon, 
  UserIcon,
  Star, 
  Plus,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Testimonialcard from "../components/Testimonialcard";
import Image from 'next/image';

interface Rating {
  star: number;
  percentage: number;
  }

interface Organization {
  _id: string;
  admin: string;
  name: string;
  logo: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [TotalOrganization, setTotalOrganization] = useState<number>(0);
  const [Organization, setOrganization] = useState<Organization[]>([]);
  const [TotalTestimonials, setTotalTestimonials] = useState<number>(0);
  const [avgrating, setavgrating] = useState<number>(0);
  const [last5testimonial, setlast5testimonial] = useState<Testimonial[]>([]);
  const [ratingData, setRatingData] = useState<Rating[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);

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
    async function fetchData() {
      try {
        const [organizationsResponse, testimonialsResponse, avgRatingResponse, ratingDistributionResponse, last5TestimonialsResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/admin-organization", { params: { admin: user?.fullName } }),
          axios.get("http://localhost:3001/api/admin-Testimonials", { params: { admin: user?.fullName } }),
          axios.get("http://localhost:3001/api/avgrating", { params: { admin: user?.fullName } }),

          axios.get("http://localhost:3001/api/rating-distribution", { params: { admin: user?.fullName } }),
          axios.get("http://localhost:3001/api/last5testimonials", { params: { admin: user?.fullName } }),
        ]);
  
        setOrganization(organizationsResponse.data);
        setTotalOrganization(organizationsResponse.data.length);
  
        setTotalTestimonials(testimonialsResponse.data);
  
        if (avgRatingResponse.data != null) {
          setavgrating(avgRatingResponse.data.toFixed(2));
        }
  
        setRatingData(ratingDistributionResponse.data);
  
        setlast5testimonial(last5TestimonialsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [user?.fullName]);
  
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
                {Organization.map( (orga:Organization) => (
                  <Link key={orga._id} href={`/organization/${orga.name}`}>           
                    <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                      <UsersIcon className="w-5 h-5" />
                      <span>{orga.name}</span>
                      </li>
                  </Link>
                ))}
               
                <Link href={`/settings`}>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <SettingsIcon className="w-5 h-5" />
                  <span>Settings</span>
                </li>
                </Link>
              </>
            ) : (
              <>
              <Link href={'/dashboard'}>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <HomeIcon className="w-6 h-6" />
                </li>
              </Link>
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

      {loading ?  (
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
):
      <div className="flex-1 p-8 bg-zinc-950 text-white pt-20 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 flex justify-center p-4 rounded-lg shadow-lg flex-col">
            <h2 className="">Total Testimonials</h2>
            <div className="text-2xl font-bold">{TotalTestimonials}</div>
            <p className="text-xs text-muted-foreground">from {TotalOrganization} Organization</p>
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
       <div className="mt-6 text-white">
        <h2 className="text-xl font-bold">Your Testimonial Spaces</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
        {Organization.map((org:Organization) => (
              <div key={org._id} className="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col">
                <div className="flex items-center justify-between">
                <div>
                <h3 className="text-lg font-semibold">{org.name}</h3>
                <p className="text-sm text-muted-foreground">{org.title}</p> 
                </div>
                <Image 
                  src={`data:image/png;base64,${org.logo}`} 
                  alt="Organization Logo"
                  className="w-10 h-10 rounded-full"
                  width={5}
                  height={5}
                />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  {/* <div>
                  <div className="text-muted-foreground">Testimonials</div>
                  <div className="font-medium">35</div>
                </div> */}
                <div className="flex gap-3 mt-5">
                    <div className="text-muted-foreground">Created At</div>
                    <div className="">: {new Date(org.createdAt).toLocaleDateString('en-GB')}</div> 
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                <Link href={`/organization/${org.name}`}>         
                  <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                    Manage
                  </button>
                  </Link>
                  <Link href={`/embed/${org.name}`}>
                  <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                    Embed
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          <div className="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800">
            <Link href={`/create-organization`}>
            <div className="rounded-full bg-zinc-900 p-3 place-self-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-3 font-medium place-self-center">Create New Organization</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Add a new testimonial collection for another product or service
            </p>
          </Link>
          </div>
        </div>
      </div>
      <h2 className="text-xl mt-6 font-bold">Recent Testimonials</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {last5testimonial.map((testimonial: Testimonial, index) => (
          <div key={`testimonial-${index}`}>
            <Testimonialcard key={`testimonial-card-${index}`} index={index} testimonial={testimonial} />
            <p className="-mt-6 flex justify-end mr-2 text-gray-500 text-xs">{testimonial.organizationName}</p>
          </div>
        ))}
        </div>
      </div> }
      
    </div>
  );
}
