import { createProfile } from '@/app/actions/create-profile'
import { createUser } from '@/app/actions/create-user'
import { createClerkClient } from '@clerk/backend'
import { NextResponse } from 'next/server'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

//TODO: do more/better validation to ensure request is coming in from Clerk
export async function POST(request: Request) {
  console.debug('in clerk webhook')

  try {
    const json = await request.json()
    console.debug('XX in webhook json', json)
    const eventType = json.type
    console.debug('XX in webhook eventType', eventType)
    if (eventType === "user.created") {
      console.debug('XX in webhook have user created')
      const data = json.data
      console.debug('XX in webhook data', data)

      const { id, email_addresses } = data
      const email = email_addresses[0].email_address
      console.debug('XX in webhook email', email)

      const userId = await createUser(email, id)
      console.debug('XX in webhook created user with id: ', userId)

      const profileId = await createProfile(userId)
      console.debug('XX in webhook created profile with id: ', profileId)

      try {
        await clerkClient.users.updateUserMetadata(id, {
          unsafeMetadata: {
            userId: userId,
            profileId: profileId
          }
        })
        console.debug('XX in webhook updated clerk user metadata')

      } catch (error) {
        console.error('couldnt update metadata', error)
      }

      return NextResponse.json({ success: true }, { status: 200 })
    }
    else {
      return NextResponse.json({ success: false, message: "Invalid event type" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}