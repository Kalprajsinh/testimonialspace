"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activePage, setActivePage] = useState(1); // Track the active page

  // Function to handle page change
  const handlePageChange = (page:any) => {
    setActivePage(page);
  };

  return (
    <div className="pt-16">
    <div style={{ display: "flex" }}>

      <div className="flex flex-col" style={{ width: "200px", borderRight: "1px solid #ccc", padding: "10px" }}>
        <button className="border mt-2 cursor-pointer" onClick={() => handlePageChange(1)}>Page 1</button>
        <button className="border mt-2 cursor-pointer" onClick={() => handlePageChange(2)}>Page 2</button>
        <button className="border mt-2 cursor-pointer" onClick={() => handlePageChange(3)}>Page 3</button>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Dashboard</h1>
        {activePage === 1 && <p>Content for Page 1</p>}
        {activePage === 2 && <p>Content for Page 2</p>}
        {activePage === 3 && <p>Content for Page 3</p>}
      </div>
    </div>
    </div>
  );
}
