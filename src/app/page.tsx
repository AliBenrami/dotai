"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/signin");
  };

  return (
    <div className="w-screen h-screen">
      <nav className="p-4 bg-slate-800 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            DotAI
          </Link>
          <ul className="flex gap-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={navigateToLogin}
                className="hover:underline cursor-pointer"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto flex flex-col items-center justify-center h-[calc(100%-76px)] px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to DotAI</h1>
          <p className="text-xl mb-8">
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
