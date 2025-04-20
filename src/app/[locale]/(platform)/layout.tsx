import PlatformNavBar from "./components/PlatformNavBar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PlatformNavBar></PlatformNavBar>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
