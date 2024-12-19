'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { profileIdAtom, userIdAtom } from '@/stores/profileAtoms'
import { useLogout } from '@/utils/auth'
import { useUser } from "@clerk/nextjs"
import { useAtom } from 'jotai'
import { AlertCircle, FileText, Frown, Meh, Plus, Smile } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type InterviewAnalysis = {
  id: string
  date: string
  company: string
  role: string
  interviewer: string
  interviewerRole: string
  readiness: string
}

const getScoreIcon = (score: string) => {
  switch (score) {
    case 'Ready':
      return <Smile className="w-5 h-5 text-green-500" />;
    case 'Kinda Ready':
      return <Meh className="w-5 h-5 text-yellow-500" />
    case 'Not Ready':
      return <Frown className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-6 h-6 text-slate-400" />
  }
};

export default function Dashboard() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<InterviewAnalysis[]>()
  const [searchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof InterviewAnalysis>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const [profileId, setProfileId] = useAtom(profileIdAtom)
  const [userId] = useAtom(userIdAtom)
  // const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const logout = useLogout()
  const { user, isLoaded, isSignedIn } = useUser()

  const handleSort = (column: keyof InterviewAnalysis) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedAnalyses = analyses?.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  }) || []

  const filteredAnalyses = sortedAnalyses.filter(
    analysis => analysis.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                analysis.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                analysis.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    console.log('XXX in Dashboard useEffect Clerk user', user)
    console.log('XXX in Dashboard useEffect profileId', profileId)
    console.log('XXX in Dashboard useEffect userId', userId)

    if (!profileId) {
      if (!user?.id) {
        logout().then(() => {
          router.push('/sign-in');
        });
      } else {
        fetch(`/api/users?clerk_id=${user.id}`)
        .then(response => response.json())
        .then(json => {
          console.log('user: ', json)
          setProfileId(json.profile.id)
          if (json.error) {
            logout().then(() => {
              router.push('/sign-in');
            })
          }
        })
      }
      return
    }
    fetch(`/api/interviews?profileId=${profileId}`)
    .then(response => {
      if (!response.ok) {
        console.error('Failed to fetch interview data:', response)
        logout().then(() => {
          router.push('/sign-in');
        });
        throw new Error('Failed to fetch interview data');
      }
      return response.json()
    })
    .then(data => {
      const mappedAnalyses: InterviewAnalysis[] = data.content.map((item: any) => ({
        id: item.id || String(Math.random()),
        date: item.interview_date || new Date().toISOString().split('T')[0],
        company: item.company_name || '',
        role: item.role_name || '',
        interviewer: item.interviewer_name || '',
        interviewerRole: item.interviewer_role || '',
        readiness: item.readiness || 'No Data'
      }));

      console.log('mappedAnalyses', mappedAnalyses);
      setAnalyses(mappedAnalyses)
    })
    .catch(error => {
      console.error('Error fetching interview data:', error)
    });
  }, [profileId, userId])

  const handleAddInterview = useCallback(async () => {
    try {
      const response = await fetch(`/api/available-interviews?profileId=${profileId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch payments info')
      }
      const data = await response.json()

    if (data.interviewsAvailable > 0) {
        router.push('/add-interview')
      } else {
        router.push('/buy')
      }
    } catch (error) {
      console.error('Error checking available interviews:', error)
      router.push('/buy')
    }
  }, [profileId, router])

  return (
    <div className="h-[80vh]">
      <div className="h-full p-4 md:p-8 font-sans">
        <div className="h-full max-w-7xl mx-auto">
          <div className="h-full bg-[#252b3b] rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#F9FAFB] text-xl md:text-[22px] font-bold">Interviews</h2>
              <Button
                onClick={handleAddInterview}
                className="bg-[#10B981] text-[#F9FAFB] hover:bg-[#059669] text-sm md:text-base font-bold"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Interview
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm hidden md:table-cell">Date</TableHead>
                    <TableHead onClick={() => handleSort('company')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Company</TableHead>
                    <TableHead onClick={() => handleSort('role')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm hidden md:table-cell">Role</TableHead>
                    <TableHead onClick={() => handleSort('interviewer')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm hidden md:table-cell">Interviewer</TableHead>
                    <TableHead onClick={() => handleSort('interviewerRole')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm hidden md:table-cell">Interviewer Role</TableHead>
                    <TableHead onClick={() => handleSort('readiness')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Readiness</TableHead>
                    <TableHead className="text-[#F9FAFB] text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id} className="hover:bg-[#374151] cursor-pointer">
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm hidden md:table-cell">{new Date(analysis.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.company}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm hidden md:table-cell">{analysis.role}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm hidden md:table-cell">{analysis.interviewer}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm hidden md:table-cell">{analysis.interviewerRole}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">
                        <div className="flex items-center">
                          {getScoreIcon(analysis.readiness)}
                          <span className="ml-2">{analysis.readiness}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex space-x-1 md:space-x-2">
                          <Link href={`/company-prep`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                          <Link href={`/interviewer-prep`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                          <Link href={`/interview-ready?interviewId=${analysis.id}`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}