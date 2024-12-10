import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import { clerkClient } from '@clerk/clerk-sdk-node'

type ClerkError = {
  errors: {
    code: string
    message: string
    longMessage: string
  }[]
}

export async function createUser(
  email: string,
): Promise<{ id: number; clerkId: string, errorMessage?: string }> {
  try {
    // 1. Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      skipPasswordRequirement: true, // Allow passwordless signup
    })

    // 2. Create user in your database
    const table = getTable('users')
    const result = await sql.query(`
      INSERT INTO ${table} (clerk_id)
      VALUES ('${clerkUser.id}')
      RETURNING id
    `)

    return {
      id: result.rows[0].id,
      clerkId: clerkUser.id
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'errors' in error) {
      const clerkError = error as ClerkError
      console.error('Error creating user record errors:', clerkError.errors[0].code)
      console.error('Error: ', clerkError.errors[0].message)
    } else {
      console.error('Error creating user record:', error)
    }
    throw error
  }
}
