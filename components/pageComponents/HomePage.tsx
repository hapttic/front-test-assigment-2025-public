"use client";

import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-cyan-400 via-teal-500 to-lime-400 animate-gradient-x text-gray-900 p-6 space-y-6">
      <h1 className="text-6xl font-extrabold text-center drop-shadow-lg animate-slide-up delay-100">
        Hello, I&apos;m Ioane!
      </h1>
      <p className="text-2xl max-w-2xl text-center drop-shadow-sm animate-slide-up delay-200">
        Welcome to my Haptic Frontend Challenge showcase. Explore how I built a
        Campaign Analytics Dashboard.
      </p>
      <button
        onClick={handleClick}
        className="cursor-pointer relative px-10 py-4 font-semibold rounded-lg bg-gray-900 text-cyan-400 shadow-md overflow-hidden group transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 hover:shadow-xl animate-slide-up delay-300"
      >
        <span className="absolute inset-0 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
        <span className="relative z-10">See Challenge Solution</span>
      </button>
      <p className="text-sm text-gray-900/70 text-center max-w-sm animate-slide-up delay-400">
        Used Next.js 14, React 18, TypeScript, Tailwind CSS, React Query & axios
      </p>
    </div>
  );
};

export default HomePage;
