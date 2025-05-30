import AuthNavbar from "./components/NavBar";
import ToastHandler from "./components/ToastHandler";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen flex pt-5 flex-col"
      style={{
        background:
          "radial-gradient(ellipse at center, #998ea7 0%, #998ea7 20%, #c9bdc7 70%)",
      }}
    >
      <AuthNavbar />
      <ToastHandler />
      <div className="pt-10 max-w-xl w-full mx-auto">{children}</div>
    </main>
  );
}
