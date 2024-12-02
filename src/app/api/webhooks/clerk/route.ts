// import { createUser } from "@/app/actions";
import { NextResponse } from "next/server";
// import { clerkClient } from '@clerk/clerk-sdk-node';
import { createProfile } from "@/app/actions/x";
// import  Mixpanel  from 'mixpanel';
import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
// const mixpanel = Mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`);

//TODO: do more/better validation to ensure request is coming in from Clerk
export async function POST(request: Request) {
  console.debug('in clerk webhook')

  try {
    const json = await request.json();
    console.debug('XX in webhook json', json)
    const eventType = json.type;
    console.debug('XX in webhook json', eventType)
    if (eventType === "user.created") {
      console.debug('XX in webhook have user created')
      const data = json.data;
      console.debug('XX in webhook data', data)

      const { id, email_addresses } = data;
      const email = email_addresses[0].email_address;
      console.debug('XX in webhook email', email);

      const profileId = await createProfile(email, id);

      console.debug('XX in webhook created profile with id: ', profileId);

      try {
        await clerkClient.users.updateUserMetadata(id, {
          unsafeMetadata: {
            profileId: profileId
          }
        });
        console.debug('XX in webhook updated clerk user metadata');

        // await clerkClient.users.updateUser(id, {
        //   firstName: data.public_metadata.first_name,
        //   lastName: data.public_metadata.last_name,
        // });

        // mixpanel.people.set(userId.toString(), {
        //   $first_name: first_name,
        //   $last_name: last_name,
        //   $email: email,
        //   $created: (new Date()).toISOString()
        // });
        // console.log('1');

        // mixpanel.track('Signed Up', {
        //   distinct_id: userId.toString(),
        //   name: `${first_name} ${last_name}`,
        // });
        // console.log('2');

      } catch(error) {
        console.error('couldnt update metadata', error);
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }
    else if (eventType === "session.created") {
      //TODO: needed? do something here?
      console.debug('session created!!!')
      return NextResponse.json({ success: true }, { status: 200 });
    }
    else {
      return NextResponse.json({ success: false, message: "Invalid event type" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}