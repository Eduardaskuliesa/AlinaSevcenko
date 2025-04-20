import Navigation from "./components/Navigation";

export default function MyCoursersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="h-[9rem] bg-primary w-full flex">
        <div className="max-w-4xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-8 mb-[1.92rem] font-semibold text-gray-100">
            My learning
          </h1>
          <Navigation />
        </div>
      </header>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
