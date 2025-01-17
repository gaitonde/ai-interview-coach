import { Profile } from '@/app/api/resume/route'
import * as React from 'react'

export const NewEmailTemplate: React.FC<Readonly<{ email: string, env: string }>> = ({
  email,
  env
}) => (
  <div>
    <div>A new email has been submitted!</div>
    <ul>
      <li>Email: {email}</li>
      <li>Env: {env}</li>
    </ul>
    <p>* - Note this is the email from the landing page. The user may change it when saving the profile.</p>
  </div>
);
