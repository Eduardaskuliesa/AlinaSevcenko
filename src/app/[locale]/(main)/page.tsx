"use client";
import { Link } from "@/i18n/navigation";
import { useTransitionRouter } from "next-view-transitions";
import Image from "next/image";
import { pageAnimation } from "./pageTransition";

export default function Home() {
  const router = useTransitionRouter();
  return (
    <>
      <main className="bg-background min-h-screen p-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-primary rounded-t-full h-[400px] w-[400px] mx-auto flex relative">
            <Image
              objectFit="cover"
              alt="Alina Photo"
              src={"/AlinaPhoto.jpg"}
              fill
              sizes="100%"
              priority
              quality={100}
              className="w-full h-full rounded-t-full"
            ></Image>
          </div>
          <div className="text-7xl font-times font-semibold text-center mb-2">
            Welcome
          </div>
          <div className="w-full h-1 bg-primary mb-10"></div>
          <div className="flex flex-col items-center gap-6">
            <Link
              href={"/about"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/about", {
                  onTransitionReady: pageAnimation,
                });
              }}
              className="bg-secondary hover:bg-secondary-light transition-colors hover:shadow-lg w-full shadow-md text-center flex flex-col rounded-full"
            >
              <span className=" text-xl font-semibold text-gray-800">
                About Me
              </span>{" "}
              <span className="text-gray-700">
                Brief description about me and my methods
              </span>
            </Link>
            <Link
              href={"/contact"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/contact", {
                  onTransitionReady: pageAnimation,
                });
              }}
              className="bg-secondary hover:bg-secondary-light hover:shadow-lg transition-colors w-full shadow-md  text-center flex flex-col rounded-full"
            >
              <span className=" text-xl font-semibold text-gray-800">
                Contact Me
              </span>{" "}
              <span className="text-gray-700">
                Brief description about me and my methods
              </span>
            </Link>
            <Link
              href={"/personal"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/personal", {
                  onTransitionReady: pageAnimation,
                });
              }}
              className="bg-secondary hover:bg-secondary-light hover:shadow-lg transition-colors w-full shadow-md  text-center flex flex-col rounded-full"
            >
              <span className=" text-xl font-semibold text-gray-800">
                Personal
              </span>{" "}
              <span className="text-gray-700">
                Book a meeting with me and get to know me better
              </span>
            </Link>
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
