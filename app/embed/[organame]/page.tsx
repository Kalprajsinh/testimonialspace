"use client"

import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  SettingsIcon, 
  UsersIcon,
  CopyIcon,
  CheckIcon
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Favoritetestimonialtwo } from "@/app/components/Favoritetestimonial";
// import Image from "next/image";

export default function BlogPost() 
{

  const params = useParams<{ organame: string }>()

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showCheck1, setShowCheck1] = useState<boolean>(false);
  const [showCheck2, setShowCheck2] = useState<boolean>(false);
  // const [showCheck3, setShowCheck3] = useState<boolean>(false);

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

  const [selectedLayout, setSelectedLayout] = useState<string>("grid");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  type LayoutType = "grid" | "autoscroll" | "topthree" | "slider";
  type PreviewImagesType = {
    [key in LayoutType | `${LayoutType}dark`]: string;
  };

  const previewImages: PreviewImagesType = {
    grid: "/images/grid.png",
    autoscroll: "/images/autoscroll.png",
    topthree: "/images/topthree.png",
    slider: "/images/slider.png",
    griddark: "/images/griddark.png",
    autoscrolldark: "/images/autoscrolldark.png",
    topthreedark: "/images/topthreedark.png",
    sliderdark: "/images/sliderdark.png"
  };

  const getPreviewImage = (): string => {
    const layout = selectedLayout as LayoutType;
    const theme = isDarkMode ? "dark" : "";
    const key = `${layout}${theme}` as keyof PreviewImagesType;
    return previewImages[key] || previewImages[layout];
  };

  return (
    <div className="w-full h-full bg-zinc-950 sm:flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-10"
        } h-[200hvm] bg-zinc-900 pt-16 text-white transition-all duration-300 shadow-lg hidden sm:block`}
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

                <Link href={`/organization/${params.organame}`}>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <UsersIcon className="w-5 h-5" />
                  <span>{params.organame}</span>
                </li>
              </Link>

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
                  <HomeIcon className="w-5 h-5" />
                </li>
              </Link>
              
                <Link href={`/organization/${params.organame}`}>
                <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                <UsersIcon className="w-5 h-5" />
                </li>
              </Link>
              <Link href={`/settings`}>
                <li onClick={()=> {("settings")}} className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                  <SettingsIcon className="w-5 h-5" />
                </li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-8 pt-20">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">Embed Your Testimonials</h2>
      <p className="text-sm text-gray-300 mt-2">Add testimonials to your website with a simple code snippet.</p>
      <hr className="text-white mt-2" />
    </div>
    <div className="space-y-6">
      <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
        <div className="font-mono text-sm flex items-center justify-between w-full">

        <pre id="codeBlock" className="overflow-x-auto whitespace-pre-wrap break-words">
          &lt;<span className="text-sky-400">div</span> <span className="text-green-500">id=</span><span className="text-orange-500">&quot;testimonial&quot;</span> <span className="text-green-500">admin=</span><span className="text-orange-500">&quot;{user?.fullName}&quot;</span> <span className="text-green-500">organization=</span><span className="text-orange-500">&quot;{params.organame}&quot;</span> <span className="text-green-500">theme=</span><span className="text-orange-500">&quot;{isDarkMode ? 'dark' : 'light'}&quot;</span>&gt;&lt;/<span className="text-sky-400">div</span>&gt;
          <br />
          &lt;<span className="text-sky-400">script</span> <span className="text-green-500">src=</span><span className="text-orange-500">&quot;https://testimonialspace.vercel.app/{selectedLayout}.js&quot;</span>&gt;&lt;/<span className="text-sky-400">script</span>&gt;
          <br />
          &lt;<span className="text-sky-400">script</span> <span className="text-green-500">src=</span><span className="text-orange-500">&quot;https://cdn.tailwindcss.com&quot;</span>&gt;&lt;/<span className="text-sky-400">script</span>&gt;
        </pre>

          <button onClick={()=>{
            setShowCheck1(true);
            setTimeout(() => {
              setShowCheck1(false);
            }, 1000);
            navigator.clipboard.writeText(`
              <div id="testimonial" admin="${user?.fullName}" organization="${params.organame}" theme="${isDarkMode ? 'dark' : 'light'}"></div>
              <script src="https://testimonialspace.vercel.app/${selectedLayout}.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              `);
            }} 
            className="hover:text-blue-400 cursor-pointer"
          >
            <CopyIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck1 ? 'hidden' : 'block'}`} />
            <CheckIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck1 ? 'block' : 'hidden'}`} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-white flex"><p className="w-1/2">Layout Options</p><p className="ml-3 hidden sm:block">Peview</p></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={()=>{setSelectedLayout("grid")}} className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:bg-zinc-800 hover:scale-102 ${selectedLayout === "grid" ? "bg-zinc-800" : ""}`}>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300"></div>
            <span className="mt-2 text-sm font-semibold text-gray-200">Grid</span>
          </div>
          <div onClick={()=>{setSelectedLayout("autoscroll")}} className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:bg-zinc-800 hover:scale-102 ${selectedLayout === "autoscroll" ? "bg-zinc-800" : ""}`}>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300"></div>
            <span className="mt-2 text-sm font-semibold text-gray-200">Auto Scroll</span>
          </div>
          <div onClick={()=>{setSelectedLayout("topthree")}} className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:bg-zinc-800 hover:scale-102 ${selectedLayout === "topthree" ? "bg-zinc-800" : ""}`}>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300"></div>
            <span className="mt-2 text-sm font-semibold text-gray-200">Top Three</span>
          </div>
          <div onClick={()=>{setSelectedLayout("slider")}} className={`flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:bg-zinc-800 hover:scale-102 ${selectedLayout === "slider" ? "bg-zinc-800" : ""}`}>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300 mb-1"></div>
            <div className="h-2 w-full rounded-sm bg-gray-300"></div>
            <span className="mt-2 text-sm font-semibold text-gray-200">Slider</span>
          </div>
         
              <label className="inline-flex cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
              </label>

        </div>
        <div className="overflow-y-auto max-h-96">
          <img 
            src={getPreviewImage()} 
            alt={`${selectedLayout} preview`} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        </div>
      </div>
  </div>

  <Favoritetestimonialtwo />

      <div className="mt-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Collection Form</h2>
        <p className="text-sm text-gray-300">Share this form with your customers to collect testimonials.</p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-lg p-6 shadow-md bg-zinc-900 max-w-2xl">
          <h3 className="mb-3 text-lg font-semibold text-white">Collection Link</h3>
          <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
          <div className="font-mono text-sm flex items-center justify-between">
          
          <span className="text-orange-500">https://testimonialspace.vercel.app/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}</span> 

            <button onClick={()=>{
              setShowCheck2(true);
              setTimeout(() => {
                setShowCheck2(false);
              }, 1000);
              navigator.clipboard.writeText(`
                https://testimonialspace.vercel.app/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}
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

        {/* <div className="flex-1 rounded-lg p-6 shadow-md bg-zinc-900">
          <h3 className="mb-3 text-lg font-semibold text-white">Embed Form</h3>
          <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md max-w-2xl">
          <div className="font-mono text-xs flex items-center justify-between">
            <span className="text-orange-500 overflow-x-auto mr-20">&lt;iframe src=&quot;https://testimonialspace.vercel.app/collection-form/{user?.fullName ? encodeURIComponent(user?.fullName) : ""}/{params.organame}&quot; width=&quot;100%&quot; height=&quot;400&quot;&gt;&lt;/iframe&gt;</span>

            <button onClick={()=>{
              setShowCheck3(true);
              setTimeout(() => {
                setShowCheck3(false);
              }, 1000);
              navigator.clipboard.writeText(`
                <iframe src="https://testimonialspace.vercel.app/collection-form/${user?.fullName ? encodeURIComponent(user?.fullName) : ""}/${params.organame}" width="100%" height="400"></iframe>
                `);
              }} 
              className="hover:text-blue-400 cursor-pointer"
            >
            <CopyIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck3 ? 'hidden' : 'block'}`} />
            <CheckIcon className={`w-5 h-5 transition-opacity duration-200 ${showCheck3 ? 'block' : 'hidden'}`} />
            </button>
          </div>
        </div>
        </div> */}
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