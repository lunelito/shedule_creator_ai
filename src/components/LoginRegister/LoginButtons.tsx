"use client";
import Image from "next/image";
import { useState } from "react";

export default function LoginButtons() {
  const [isGithubHover, setIsGithubHover] = useState(false);
  const [isGoogleHover, setIsGoogleHover] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full justify-center items-center">
      <div
        className="flex justify-center items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg w-[80%] sm:w-auto"
        onMouseEnter={() => setIsGithubHover(true)}
        onMouseLeave={() => setIsGithubHover(false)}
      >
        <Image
          src={
            isGithubHover
              ? "/Icons/github/github_teal.svg"
              : "/Icons/github/github_black.svg"
          }
          className={`transition-all duration-200 ${
            isGithubHover ? "invert-0 brightness-100" : "invert brightness-0"
          }`}
          alt="GitHub"
          width={28}
          height={28}
        />
        <p
          className={`font-medium transition-colors duration-200 ${
            isGithubHover ? "text-teal-500" : "text-white"
          }`}
        >
          Login with Github
        </p>
      </div>
      <div
        className="flex justify-center items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg w-[80%] sm:w-auto"
        onMouseEnter={() => setIsGoogleHover(true)}
        onMouseLeave={() => setIsGoogleHover(false)}
      >
        <Image
          src={
            isGoogleHover
              ? "/Icons/google/google_teal.svg"
              : "/Icons/google/google_black.svg"
          }
          className={`transition-all duration-200 ${
            isGoogleHover ? "invert-0 brightness-100" : "invert brightness-0"
          }`}
          alt="Google"
          width={28}
          height={28}
        />
        <p
          className={`font-medium transition-colors duration-200 ${
            isGoogleHover ? "text-teal-500" : "text-white"
          }`}
        >
          Login with Google
        </p>
      </div>
    </div>
  );
}
