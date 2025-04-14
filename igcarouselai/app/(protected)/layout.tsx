'use client';

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  return <>{children}</>;
}