import * as React from 'react'

export const NewUserEmailTemplate: React.FC<Readonly<{ email: string, env: string, clerkId: string, profileId: string }>> = ({
  email,
  env,
  clerkId,
  profileId
}) => (
  <div>
    <div>A new user signed up!</div>
    <ul>
      <li>Email: {email}</li>
      <li>TIP Profile ID: {profileId}</li>
      <li>Clerk ID: {clerkId}</li>
      <li>Env: {env}</li>
    </ul>
  </div>
);
