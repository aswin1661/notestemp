"use client";

import Link from "next/link";

export default function Notes() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/ucek.jpg')",
        filter: "sepia(0.4) saturate(1) contrast(1) brightness(0.9)",
      }}
    >
      <div className="-mt-10 flex flex-col items-center w-full max-w-6xl">
        <div className="text-white text-3xl font-bold mb-14 text-center bg-black/40 px-6 py-4 rounded-2xl backdrop-blur-md shadow-md border-1 border-gray-700">
          Select Department
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
          {[
            { name: "General Dept", href: "/gd" },
            { name: "CSE", href: "/cse" },
            { name: "ECE", href: "/ece" },
            { name: "IT", href: "/it" },
          ].map((dept) => (
            <Link href={dept.href} key={dept.name}>
              <div className="bg-black/40 hover:bg-black/60 transition text-white rounded-2xl backdrop-blur-md h-22 w-full shadow-md text-center text-xl font-semibold flex items-center justify-center aspect-square sm:aspect-auto sm:h-18 border-1 border-gray-700">
                {dept.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
