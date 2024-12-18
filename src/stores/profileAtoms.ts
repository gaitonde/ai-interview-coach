import { atom } from 'jotai'
import { getFromLocalStorage, setToLocalStorage } from '@/utils/localStorage'

// Initialize atoms with values from localStorage
const initialProfileId = getFromLocalStorage('profileId') || ''
const initialUserId = getFromLocalStorage('userId') || ''
const initialInterviewId = getFromLocalStorage('interviewId') || ''
const initialIsDemo = getFromLocalStorage('isDemo') || false
const initialShowScore = getFromLocalStorage('showScore') || false

export const profileIdAtom = atom(initialProfileId)
export const userIdAtom = atom(initialUserId)
export const interviewIdAtom = atom(initialInterviewId)
export const isDemoAtom = atom(initialIsDemo)
export const showScoreAtom = atom(initialShowScore)

// Create wrapper atoms that sync with localStorage
export const profileIdAtomWithStorage = atom(
  (get) => get(profileIdAtom),
  (get, set, newValue: string) => {
    set(profileIdAtom, newValue)
    setToLocalStorage('profileId', newValue)
  }
)

export const userIdAtomWithStorage = atom(
  (get) => get(userIdAtom),
  (get, set, newValue: string) => {
    set(userIdAtom, newValue)
    setToLocalStorage('userId', newValue)
  }
)

export const interviewIdAtomWithStorage = atom(
  (get) => get(interviewIdAtom),
  (get, set, newValue: string) => {
    set(interviewIdAtom, newValue)
    setToLocalStorage('interviewId', newValue)
  }
)

export const isDemoAtomWithStorage = atom(
  (get) => get(isDemoAtom),
  (get, set, newValue: boolean) => {
    set(isDemoAtom, newValue)
    setToLocalStorage('isDemo', newValue)
  }
)

export const showScoreAtomWithStorage = atom(
  (get) => get(showScoreAtom),
  (get, set, newValue: boolean) => {
    set(showScoreAtom, newValue)
    setToLocalStorage('showScore', newValue)
  }
)
