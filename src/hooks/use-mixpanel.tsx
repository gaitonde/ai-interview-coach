import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = '3ba8618be12d005734f09dfbfa7d000d'

export const useMixpanel = () => {
  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN)
  }, [])

  const track = (event: string, properties?: Record<string, any>) => {
    // if (process.env.NODE_ENV === 'production') {
      mixpanel.track(event, properties)
    // }
  }

  const identify = (profileId: string) => {
    // if (process.env.NODE_ENV === 'production') {
      mixpanel.identify(profileId)
    // }
  }

  return { track, identify }
}
