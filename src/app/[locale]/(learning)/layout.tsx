import Footer from "../(platform)/components/Footer";

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-gray-50">
      {children}
      <Footer />
    </div>
  );
}
