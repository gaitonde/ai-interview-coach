'use client'

import Dashboard from "@/components/dashboard"
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = useAuth()
  console.debug('XX in home userId', userId)

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <Dashboard />
    </>
  );
}
