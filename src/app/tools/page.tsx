'use client';

import Hero from "@/components/hero";
import ToolsSection from "@/components/tools-section";
import { useMixpanel } from "@/hooks/use-mixpanel";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export default function Tools() {
  const { track } = useMixpanel();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user && isSignedIn) {
      track('ViewedToolsHomeSignedIn', {id: user.id});
    } else {
      track('ViewedToolsHomeAnonymous');
    }
  }, [isSignedIn, track])

    return (
      <>
        <Hero />
        <ToolsSection />
      </>
    );

}
