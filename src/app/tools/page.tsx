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
      //TODO: get profileId from Cookies.get('profileId)
      track('v2.ViewedToolsHomeSignedIn', {clerkUserId: user.id });
    } else {
      track('v2.ViewedToolsHomeAnonymous');
    }
  }, [isSignedIn, track])

    return (
      <>
        <Hero />
        <ToolsSection />
      </>
    );

}
