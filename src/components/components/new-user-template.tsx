import * as React from 'react'

export const NewUserEmailTemplate: React.FC<Readonly<{ email: string, env: string, userId: string, profileId: string, clerkId: string }>> = ({
  email,
  env,
  userId,
  profileId,
  clerkId,
}) => (
  <div>
    <div>A new user signed up!</div>
    <ul>
      <li>Email: {email}</li>
      <li>TIP Profile ID: {profileId}</li>
      <li>TIP User ID: {userId}</li>
      <li>Clerk User ID: {clerkId}</li>
      <li>Env: {env}</li>
    </ul>
  </div>
);
