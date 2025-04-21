import React from "react";
import NavBar from "./NavBar";
import AlertComponent from "./AlertComponent";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl p-6">
      <NavBar></NavBar>
      <AlertComponent></AlertComponent>
      {/* Content */}
      <div className="pt-6">{children}</div>
    </div>
  );
}
