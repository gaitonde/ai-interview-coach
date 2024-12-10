import { atomWithStorage } from 'jotai/utils'

export const profileIdAtom = atomWithStorage<string | null>('profileId', null)
export const userIdAtom = atomWithStorage<string | null>('userId', null)
export const interviewIdAtom = atomWithStorage<string | null>('interviewId', null)
export const isDemoAtom = atomWithStorage('isDemo', false)
export const showScoreAtom = atomWithStorage('showScore', false)