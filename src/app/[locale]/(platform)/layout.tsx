import CartSync from "./components/CartSync";
import LanguageSuggestion from "./components/LanguageSuggestion";
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
      <LanguageSuggestion />
      <div className="">{children}</div>
    </main>
  );
}
