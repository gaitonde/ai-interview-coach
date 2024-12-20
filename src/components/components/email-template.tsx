import { Profile } from '@/app/api/resume/route'
import * as React from 'react'

export const EmailTemplate: React.FC<Readonly<Profile & { env: string }>> = ({
  first_name,
  last_name,
  email,
  id,
  env
}) => (
  <div>
    <h1>New Resume</h1>
    <div>A new resume has been uploaded!</div>
    <ul>
      <li>Name: {first_name} {last_name}</li>
      <li>Email: {email}*</li>
      <li>Profile ID: {id}</li>
      <li>Env: {env}</li>
    </ul>
    <p>* - Note this is the email from the resume. The user may have changed it when saving the profile.</p>
  </div>
);
