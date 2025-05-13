import PlatformNavBar from "./components/PlatformNavBar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <PlatformNavBar></PlatformNavBar>
      <div className="">{children}</div>
    </main>
  );
}
