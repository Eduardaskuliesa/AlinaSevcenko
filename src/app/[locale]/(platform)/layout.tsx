import CartSync from "./components/CartSync";
import PlatformNavBar from "./components/PlatformNavBar";
import SyncUserPreferences from "./components/SyncUserPreferences";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <PlatformNavBar />
      <CartSync />
      <SyncUserPreferences />
      <div className="">{children}</div>
    </main>
  );
}
