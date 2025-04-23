import React from "react";
import Image from "next/image";
import TeamImg from "../team.jpg";
import Nav from "../components/nav";

export default function AboutUs() {
  return (
    <>
      <Nav></Nav>
      <section className="min-h-screen py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are a dedicated team of professionals committed to creating
              innovative solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                Our Story
              </h2>
              <p className="text-gray-300 mb-4">
                Founded in 2023, our company began with a simple mission: to
                make technology accessible and useful for everyone. What started
                as a small project has grown into a passionate team dedicated to
                excellence and innovation.
              </p>
              <p className="text-gray-300">
                We believe in creating solutions that not only meet the current
                needs of our users but anticipate future challenges. Our
                commitment to quality and continuous improvement drives
                everything we do.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={TeamImg}
                alt="team"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Innovation
                </h3>
                <p className="text-gray-300">
                  We constantly seek new ideas and approaches to solve complex
                  problems.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Integrity
                </h3>
                <p className="text-gray-300">
                  We conduct our business with the highest ethical standards and
                  transparency.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Collaboration
                </h3>
                <p className="text-gray-300">
                  We believe in the power of teamwork and partnership to achieve
                  great results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
