'use client'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, FileText, Frown, Meh, Plus, Smile } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
      return <AlertCircle className="w-6 h-6 text-yellow-500" />
  }
};

export default function Dashboard() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<InterviewAnalysis[]>()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof InterviewAnalysis>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  // const [interviewData, setInterviewData] = useState<InterviewData | null>(null)

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

  // console.log('filteredAnalyses', filteredAnalyses);

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    if (!storedProfileId) {
      router.push('/profile-setup')
      return
    }
    fetch(`/api/jobs?profileId=${storedProfileId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch job data');
      }
      return response.json();
    })
    .then(data => {
      console.log('Raw API response:', data.content);

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
      setAnalyses(mappedAnalyses);
    })
    .catch(error => {
      console.error('Error fetching interview data:', error)
    });
  }, [])

  return (
    <div className="h-[80vh]">
      <div className="h-full p-4 md:p-8 font-sans">
        <div className="h-full max-w-7xl mx-auto">
          <div className="h-full bg-[#252b3b] rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#F9FAFB] text-xl md:text-[22px] font-bold">Interviews</h2>
              <Link href="/interview-setup" className="block">
                <Button className="bg-[#10B981] text-[#F9FAFB] hover:bg-[#059669] text-sm md:text-base font-bold">
                  <Plus className="mr-2 h-4 w-4" /> Add Interview
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Date</TableHead>
                    <TableHead onClick={() => handleSort('company')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Company</TableHead>
                    <TableHead onClick={() => handleSort('role')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Target Job</TableHead>
                    <TableHead onClick={() => handleSort('interviewer')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Interviewer</TableHead>
                    <TableHead onClick={() => handleSort('interviewerRole')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Interviewer Role</TableHead>
                    <TableHead onClick={() => handleSort('readiness')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Overall Readiness</TableHead>
                    <TableHead className="text-[#F9FAFB] text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id} className="hover:bg-[#374151] cursor-pointer">
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{new Date(analysis.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.company}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.role}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.interviewer}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.interviewerRole}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">
                        <div className="flex items-center">
                          {getScoreIcon(analysis.readiness)}
                          <span className="ml-2">{analysis.readiness}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex space-x-1 md:space-x-2">
                          <Link href={`/job-prep`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                          <Link href={`/interview-prep`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                          <Link href={`/interview-ready?analysisId=${analysis.id}`}>
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