"use client";

import { useAuth, useUser } from '@clerk/nextjs'
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AA() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const initializeUserAndProfile = async () => {
      try {
        // Create user first
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId: user.id }),
        });
        const userData = await userResponse.json();

        if (!userData.id) {
          throw new Error('Failed to create user');
        }

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
          })

          router.push('/');
        }
      } catch (error) {
        console.error('Error initializing user and profile:', error);
      }
    };

    initializeUserAndProfile();
  }, [user, router]);

  if (!user) return null;
  return null;
}
