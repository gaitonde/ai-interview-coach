// import { createUser } from "@/app/actions";
import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { createProfile } from "@/app/actions/create-profile";
// import  Mixpanel  from 'mixpanel';

// const mixpanel = Mixpanel.init(`${process.env.MIX_PANEL_TOKEN}`);

//TODO: do more/better validation to ensure request is coming in from Clerk
export async function POST(request: Request) {
  console.debug('in clerk webhook')

  try {
    const json = await request.json();
    console.debug('in webhook json', json)
    const eventType = json.type;
    console.debug('in webhook json', eventType)
    if (eventType === "user.created") {
      console.debug('in webhook have user created')
      const data = json.data;
      console.debug('in webhook data', data)

      const { id, public_metadata, email_addresses } = data;
      const { first_name, last_name } = public_metadata;
      console.debug('in webhook name', first_name, last_name);
      const email = email_addresses[0].email_address;
      console.debug('in webhook email', email);

      // TODO: do upsert instead?
      const userId = await createProfile(email, id);

      console.debug('in webhook userId', userId);

      try {
        await clerkClient.users.updateUserMetadata(id, {
          unsafeMetadata: {
            userId: userId
          }
        });

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

      return NextResponse.json({}, { status: 200 });
    }
    else if (eventType === "session.created") {
      console.debug('session created!!!')
      return NextResponse.json({}, { status: 200 });
    }
    else {
      return NextResponse.json({ success: false, message: "Invalid event type" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}