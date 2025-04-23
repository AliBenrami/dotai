"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "./components/nav";

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/signin");
  };

  return (
    <div className="w-screen h-screen">
      <Nav></Nav>
      <main className="mx-auto flex flex-col items-center justify-center h-[calc(100%-76px)] px-4 dark:bg-gray-900 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
        <div className="text-center dark:text-white">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Welcome to DotAI
          </h1>
          <p className="text-xl mb-8 dark:text-gray-300">
            The intelligent assistant for all your development needs
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={navigateToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Get Started
            </button>
            <Link
              href="/about"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
