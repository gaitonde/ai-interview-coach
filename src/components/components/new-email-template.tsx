import { Status } from "@/app/types/email"
import * as React from 'react'

export const NewEmailTemplate: React.FC<Readonly<{ email: string, status: Status, env: string }>> = ({
  email,
  status,
  env
}) => (
  <div>
    <div>A new email has been submitted!</div>
    <ul>
      <li>Email: {email}</li>
      <li>Status: {status}</li>
      <li>Env: {env}</li>
    </ul>
    <p>* - Note this is the email from the landing page. The user may change it when saving the profile.</p>
  </div>
);
