"use client"

import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  SettingsIcon, 
  MessageSquare,
  Heart,
  Code2,
  ArrowLeftIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import Dashboard from "@/app/components/dashboard-orga";
import Alltestimonial from "@/app/components/Alltestimonial";
import Texttestimonial from "@/app/components/Texttestimonial";
import Videotestimonial from "@/app/components/Videotestimonial";
import Favoritetestimonial from "@/app/components/Favoritetestimonial";
import Settings from "@/app/components/Settings";
import { useParams } from 'next/navigation'



export default function BlogPost() 
{

  const params = useParams<{ organame: string }>()

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [Maincontent, setMaincontent] = useState("Dashboard");

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

  return (
    <div className="w-full h-screen bg-zinc-950 flex">

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
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </li>
              </Link>
              
                <li onClick={()=> {setMaincontent("Dashboard")}} className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
                </li>

                <li onClick={()=> {setMaincontent("all")}} className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <MessageSquare className="w-5 h-5" />
                <span>All Testimonials</span>
                </li>
        
             
                {/* <li onClick={()=> {setMaincontent("video")}} className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Video className="w-5 h-5" />
                <span>Video Testimonials</span>
                </li> */}
             
                <li onClick={()=> {setMaincontent("favorite")}} className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Heart className="w-5 h-5" />
                <span>Favorite Testimonials</span>
                </li>
                <Link href={`/embed/${params.organame}`}>                
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                <Code2 className="w-5 h-5" />
                <span>Embed Code</span>
                </li>
                </Link>
                <li onClick={()=> {setMaincontent("settings")}} className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <SettingsIcon className="w-5 h-5" />
                  <span>Settings</span>
                </li>
              </>
            ) : (
              <>
                <Link href={'/dashboard'}>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <ArrowLeftIcon className="w-5 h-5" />
                </li>
              </Link>
              
                <li onClick={()=> {setMaincontent("Dashboard")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <HomeIcon className="w-5 h-5" />
                </li>
                <li onClick={()=> {setMaincontent("all")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <MessageSquare className="w-5 h-5" />
                </li>
        
             
                {/*  <li onClick={()=> {setMaincontent("video")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <Video className="w-5 h-5" />
                </li> */}
             
                <li onClick={()=> {setMaincontent("favorite")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <Heart className="w-5 h-5" />
                </li>

                <Link href={`/embed/${params.organame}`}>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <Code2 className="w-5 h-5" />
                </li>
                </Link>
   
                <li onClick={()=> {setMaincontent("settings")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <SettingsIcon className="w-5 h-5" />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="flex-1 bg-zinc-950 text-white overflow-y-auto">
        {Maincontent === "Dashboard" && <Dashboard />}
        {Maincontent === "all" && <Alltestimonial />}
        {Maincontent === "text" && <Texttestimonial />}
        {Maincontent === "video" && <Videotestimonial />}
        {Maincontent === "favorite" && <Favoritetestimonial />}
        {Maincontent === "settings" && <Settings />}
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