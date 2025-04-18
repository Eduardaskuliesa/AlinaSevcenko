
export default function MainLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <main 
        className="min-h-screen flex justify-center items-center"
        style={{
          background: 'radial-gradient(ellipse at center, #998ea7 0%, #998ea7 20%, #c9bdc7 70%)'
        }}
      >
        {children}
      </main>
    );
  }