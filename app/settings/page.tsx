"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  SidebarCloseIcon, 
  SidebarOpenIcon, 
  HomeIcon, 
  SettingsIcon, 
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const response = await axios.get("http://localhost:3001/api/admin-organization", {
          params: { admin: user?.fullName },
        });
        setOrganizations(response.data);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, [user?.fullName]);

  const handleDelete = async (orgId: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      try {
        await axios.delete(`http://localhost:3001/api/delete-organization`, {
          data: { admin: user?.fullName, organizationId: orgId },
        });
        setOrganizations((prev) => prev.filter((org: any) => org._id !== orgId));
      } catch (err) {
        console.error("Error deleting organization:", err);
        alert("Failed to delete the organization.");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-zinc-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

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
                  <Link href={`/settings`}>
                    <li className="flex items-center justify-center py-4 hover:bg-zinc-700 cursor-pointer rounded-lg">
                      <SettingsIcon className="w-6 h-6" />
                    </li>
                    </Link>
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
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <h2 className="text-xl font-semibold mb-4">Your Organizations</h2>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org: any) => (
        <div key={org._id} className="bg-zinc-900 p-6 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{org.name}</h3>
              <p className="text-sm text-muted-foreground">{org.title}</p>
            </div>
            <img
              src={`data:image/png;base64,${org.logo}`}
              className="w-10 h-10 rounded-full"
              alt="Organization Logo"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Link href={`/organization/${org.name}`}>
              <button className="px-4 py-2 text-sm border rounded-md border-muted hover:bg-zinc-800 cursor-pointer">
                Manage
              </button>
            </Link>
            <button
              onClick={() => handleDelete(org._id)}
              className="px-4 py-2 text-sm border rounded-md border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div> }
          
        </div>
  );
}