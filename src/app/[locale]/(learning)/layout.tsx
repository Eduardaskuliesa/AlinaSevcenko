export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-gray-50">
      {children}
    </div>
  );
}
