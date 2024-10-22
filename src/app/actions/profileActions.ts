'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function create(data: {
  school: string;
  major: string;
  concentration: string;
  graduation_year: string
}) {
  try {
    const profile = await prisma.ai_interview_coach_prod_profiles.create({
      data: {
        school: data.school,
        major: data.major,
        concentration: data.concentration,
        graduation_date: new Date(data.graduation_year),
      },
    })
    return profile
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

export async function getById(id: number) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: id },
    })
    return profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export async function update(id: number, data: { name?: string; email?: string; bio?: string }) {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { id: id },
      data: data,
    })
    return updatedProfile
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export async function deleteProfile(id: number) {
  try {
    const deletedProfile = await prisma.profile.delete({
      where: { id: id },
    })
    return deletedProfile
  } catch (error) {
    console.error('Error deleting profile:', error)
    throw error
  }
}

export async function getAll() {
  try {
    const profiles = await prisma.profile.findMany()
    return profiles
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    throw error
  }
}
