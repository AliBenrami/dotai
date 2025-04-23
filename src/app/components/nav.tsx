"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/signin");
  };
  return (
    <>
      <nav className="p-4 bg-slate-800 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            DotAI
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
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
    </>
  );
};

export default Nav;
