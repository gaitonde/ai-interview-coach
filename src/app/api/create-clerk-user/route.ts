import { clerkClient } from "@clerk/clerk-sdk-node"
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create user with Clerk
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      skipPasswordRequirement: true, // Allow passwordless signup
    })

    //Create user record in database
    //Update profile record?

    console.log('User created successfully: ', user)

    console.log('User ID: ', user.id)

    return NextResponse.json({
      userId: user.id,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
