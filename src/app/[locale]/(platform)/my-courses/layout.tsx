import Navigation from "./components/Navigation";

export default function MyCoursersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="h-auto bg-primary w-full flex">
        <div className="max-w-4xl px-4 md:px-0 w-full mx-auto">
          <h1 className="text-5xl font-times mt-8 mb-[1.92rem] font-semibold text-gray-100">
            My learning
          </h1>
          <Navigation />
        </div>
      </header>
      <main className="bg-gray-50">{children}</main>
    </>
  );
}
