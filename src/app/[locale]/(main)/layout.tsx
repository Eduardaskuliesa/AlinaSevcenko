import NavBar from "./components/NavBar";
import { ViewTransitions } from "next-view-transitions";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <NavBar />
      {children}
    </ViewTransitions>
  );
}
