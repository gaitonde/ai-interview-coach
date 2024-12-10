'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUserComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-clerk-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      console.log('User created successfully: ', response)
      const json = await response.json()
      console.log('JSON: ', json)
      // console.log('User message: ', json.message)

      // Successful user creation
      // router.push('/interview-setup');
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create a New User</h1>
      <form onSubmit={handleCreateUser}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='text-black'
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
