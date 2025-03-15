"use client";

import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  UsersIcon, 
  SettingsIcon, 
  UserIcon, 
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const { user } = useUser();

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
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </li>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <UsersIcon className="w-5 h-5" />
                  <span>Orga1</span>
                </li>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <UsersIcon className="w-5 h-5" />
                  <span>Orga2</span>
                </li>
                <li className="flex items-center space-x-4 p-4 hover:bg-zinc-700 cursor-pointer rounded-lg transition-all duration-200">
                  <UsersIcon className="w-5 h-5" />
                  <span>Orga3</span>
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

      <div className="flex-1 p-8 bg-zinc-950 text-white pt-20">
      <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-900 flex items-center justify-center p-4 rounded-lg shadow-lg">
            <h2 className="">Dashboard</h2>
          </div>
          <div className="bg-zinc-900 flex items-center justify-center p-4 rounded-lg shadow-lg">
            <h2 className="">Orga1</h2>
          </div>
          <div className="bg-zinc-900 flex items-center justify-center p-4 rounded-lg shadow-lg">
            <h2 className="">Orga2</h2>
          </div>
          <div className="bg-zinc-900 flex items-center justify-center p-4 rounded-lg shadow-lg">
            <h2 className="">Orga3</h2>
          </div>
       </div>
      </div>
    </div>
  );
}
