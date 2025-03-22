"use client";

import { useMixpanel } from "@/hooks/use-mixpanel";
import { useUser } from '@clerk/nextjs'
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AA() {
  const router = useRouter();
  const { user } = useUser();
  const { track, identify } = useMixpanel();

  useEffect(() => {
    if (!user) return;

    console.log('u: ', user);

    const initializeUserAndProfile = async () => {
      try {
        track('v2.ClerkUserCreated', { clerkUserId: user.id })
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId: user.id }),
        });
        const userData = await userResponse.json();

        if (!userData.id) {
          throw new Error('Failed to create user');
        }

        track('v2.TIPUserCreated', { clerkUserId: userData.id, email: user.emailAddresses[0].emailAddress })

        // Create profile with the returned userId
        const profileResponse = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.id,
            email: user.emailAddresses[0].emailAddress
          }),
        });
        const profileData = await profileResponse.json();

        if (profileData.id) {
          Cookies.set('profileId', profileData.id, {
            secure: true,
            sameSite: 'strict'
          });

          track('v2.ProfileCreated', { profileId: profileData.id })
          identify(profileData.id);

          router.push('/');
        }
      } catch (error) {
        console.error('Error initializing user and profile:', error);
      }
    };

    const getUserAndProfile = async () => {
      const userResponse = await fetch(`/api/users?clerk_id=${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const userData = await userResponse.json();
      console.log('ud: ', userData);

      if (userData && userData.profile) {
        Cookies.set('profileId', userData.profile.id, {
          secure: true,
          sameSite: 'strict'
        });
        track('v2.LoggedIn', { profileId: userData.profile.id })
        identify(userData.profile.id);
        router.push('/');
      } else {
        initializeUserAndProfile();
      }

    }
    getUserAndProfile();
  }, [user, router]);

  if (!user) return null;
  return null;
}
