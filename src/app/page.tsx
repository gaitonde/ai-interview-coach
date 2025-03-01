"use client";

import { Header } from "@/components/header";
import Hero from "@/components/hero"
import ToolsSection from "@/components/tools-section"
import { useUser } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      const profileId = Cookies.get('profileId');

      if (!profileId && user?.id) {
        try {
          const response = await fetch(`/api/profiles?userId=${user.id}`);
          const data = await response.json();

          if (data.profile.id) {
            Cookies.set('profileId', data.profile.id);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    }

    fetchProfile()
  }, [user])

  return (
    <main>
      <Header />
      <Hero />
      <ToolsSection />
    </main>
  )
}

