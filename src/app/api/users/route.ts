import { getTable } from "@/lib/db"
import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  // const clerkId = searchParams.get('clerk_id')
  const table = getTable('users')

  let query: string
  let params: any[]

  if (userId) {
    query = `SELECT id FROM ${table} WHERE id = $1`
    params = [userId]
  // } else if (clerkId) {
  //   query = `SELECT id FROM ${table} WHERE clerk_id = $1`
  //   params = [clerkId]
  } else {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  const result = await sql.query(query, params)
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const id = result.rows[0].id
  const profileTable = getTable('profiles')
  query = `SELECT * FROM ${profileTable} WHERE user_id = $1`
  const profileResult = await sql.query(query, [id])
  return NextResponse.json({ id, profile: profileResult?.rows[0] })
}
