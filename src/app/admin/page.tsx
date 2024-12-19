'use client'

import { useState } from 'react'
import { updateFreeInterviews } from '@/app/actions/update-free-interviews'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [numInterviews, setNumInterviews] = useState(1)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'jax') {
      setIsAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Incorrect password')
    }
  }

  const handleUpdateInterviews = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await updateFreeInterviews(email, numInterviews)

      if (updated.success) {
        setIsError(false)
        setMessage('Successfully updated free interviews')
      } else {
        setIsError(true)
        setMessage('Unable to update free interviews')
      }
    } catch (error) {
      setIsError(true)
      setMessage('Unable to update free interviews')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Enter
          </button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleUpdateInterviews} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="numInterviews" className="block text-sm font-medium text-gray-700">
            Number of Free Interviews
          </label>
          <input
            type="number"
            id="numInterviews"
            value={numInterviews}
            onChange={(e) => setNumInterviews(Math.min(10, Math.max(0, parseInt(e.target.value))))}
            min="0"
            max="10"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Update Free Interviews
        </button>
        {message && <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      </form>
    </div>
  )
}