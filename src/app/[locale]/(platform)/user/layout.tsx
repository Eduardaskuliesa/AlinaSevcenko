import Navigation from "./components/Navigation";

export default function MyCoursersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="h-auto bg-primary w-full flex">
        <div className="max-w-4xl px-4 md:px-2 w-full mx-auto">
          <h1 className="text-4xl mb-[1rem] xs:text-5xl font-times mt-8 xs:mb-[1.5rem] font-semibold text-gray-100">
            My profile
          </h1>
          <Navigation />
        </div>
      </header>
      <main className="bg-gray-50">{children}</main>
    </>
  );
}
