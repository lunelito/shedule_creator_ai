import RenderAnimation from "@/animations/RenderAnimation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function MainPage() {
  return (
    <RenderAnimation animationKey={"MainPage"}>
      <div className="flex w-full h-full flex-col p-10 justify-between md:flex-row">
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          <div className="max-w-4xl mx-auto shadow-xlp-6 sm:p-8">

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 border-b-2 border-teal-600 pb-2">
              Dashboard
            </h1>

            <p className="text-lg text-gray-300 mb-8">
              Witamy w naszym kreatorze grafików
            </p>

            <Link
              href={'/manage/add'}
              className="inline-block px-6 py-3 text-lg font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Dodaj nowy grafik
            </Link>

          </div>
        </div>
        <div className="h-full w-full flex p-10 flex-col justify-center items-center">
          <Image
            src="/logo/logo_img.png"
            alt="Logo"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </RenderAnimation>
  );
}
