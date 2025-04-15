import { Link } from "@/i18n/navigation";

export default function Home() {
  return (
    <>
      <main className="bg-background min-h-screen p-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-primary rounded-t-full h-[400px] w-[500px] mx-auto"></div>
          <div className="text-7xl font-times font-semibold text-center -mt-6 mb-2">
            Welcome
          </div>
          <div className="w-full h-1 bg-primary mb-10"></div>
          <div className="flex flex-col items-center gap-6">
            <Link
              href={"/about"}
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
              className="bg-secondary hover:bg-secondary-light hover:shadow-lg transition-colors w-full shadow-md  text-center flex flex-col rounded-full"
            >
              <span className=" text-xl font-semibold text-gray-800">
                Contact Me
              </span>{" "}
              <span className="text-gray-700">
                Brief description about me and my methods
              </span>
            </Link>
            <Link href={'/personal'} className="bg-secondary hover:bg-secondary-light hover:shadow-lg transition-colors w-full shadow-md  text-center flex flex-col rounded-full">
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
