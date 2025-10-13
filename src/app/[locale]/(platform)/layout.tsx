import CartSync from "./components/CartSync";
import Footer from "./components/Footer";
import LanguageSuggestion from "./components/LanguageSuggestion";
import ResponsiveNavBar from "./components/ResponsiveNavBar";
import SyncUserPreferences from "./components/SyncUserPreferences";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ResponsiveNavBar />
      <main className="bg-gray-50 min-h-[80vh]">
        <CartSync />
        <SyncUserPreferences />
        <LanguageSuggestion />
        <div className="">{children}</div>
      </main>
      <Footer />
    </>
  );
}
