'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, FileText, Menu, SmilePlus, Smile, Meh, Frown, MehIcon } from 'lucide-react'
import Link from 'next/link'
import { Footer } from './footer'

type InterviewAnalysis = {
  id: string
  date: string
  company: string
  role: string
  mockInterviewer: string
  overallScore: string
}

const mockData: InterviewAnalysis[] = [
  { id: '1', date: '2024-05-01', company: 'Google', role: 'Product Manager', mockInterviewer: 'Tech Lead', overallScore: 'Crushed it!' },
  { id: '2', date: '2024-04-15', company: 'Amazon', role: 'Principal Product Manager', mockInterviewer: 'Senior PM', overallScore: 'Smooth sailing!' },
  { id: '3', date: '2024-03-30', company: 'Microsoft', role: 'Product Manager', mockInterviewer: 'Design Lead', overallScore: 'Got through it.' },
  { id: '4', date: '2024-03-10', company: 'Apple', role: 'Senior Product Manager', mockInterviewer: 'Engineering Manager', overallScore: 'A bit wobbly.' },
  { id: '5', date: '2024-02-20', company: 'Facebook', role: 'Product Manager', mockInterviewer: 'Product Director', overallScore: 'Learning experience!' },
]

const getScoreIcon = (score: string) => {
  switch (score) {
    case 'Crushed it!':
      return <SmilePlus className="w-5 h-5 text-green-500" />;
    case 'Smooth sailing!':
      return <Smile className="w-5 h-5 text-green-300" />;
    case 'Got through it.':
      return <Meh className="w-5 h-5 text-yellow-500" />;
    case 'A bit wobbly.':
      return <MehIcon className="w-5 h-5 text-orange-500" />;
    case 'Learning experience!':
      return <Frown className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<InterviewAnalysis[]>(mockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof InterviewAnalysis>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: keyof InterviewAnalysis) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedAnalyses = [...analyses].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const filteredAnalyses = sortedAnalyses.filter(
    analysis => analysis.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                analysis.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                analysis.mockInterviewer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setAnalyses(analyses.filter(analysis => analysis.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1f2b]">
      <div className="flex-grow p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1f2b] border-2 border-[#10B981] flex items-center justify-center text-white text-lg md:text-xl font-bold mr-3 md:mr-4">
                LM
              </div>
              <h1 className="text-white text-lg md:text-xl font-bold">Lucy</h1>
            </div>
          </div>

          <div className="bg-[#252b3b] rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col space-y-4 mb-4">
              <Link href="/job-information-setup" className="block w-fit">
                <Button className="bg-[#10B981] text-[#F9FAFB] hover:bg-[#059669] text-sm md:text-base font-bold">
                  <Plus className="mr-2 h-4 w-4" /> Start New Interview Prep
                </Button>
              </Link>
              <h2 className="text-[#F9FAFB] text-xl md:text-[22px] font-bold">History</h2>
            </div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search by company, role, or interviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#D1D5DB] text-[#111827] placeholder-[#6B7280] text-sm md:text-base"
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('date')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Date</TableHead>
                    <TableHead onClick={() => handleSort('company')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Company</TableHead>
                    <TableHead onClick={() => handleSort('role')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Role</TableHead>
                    <TableHead onClick={() => handleSort('mockInterviewer')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Mock Interviewer</TableHead>
                    <TableHead onClick={() => handleSort('overallScore')} className="cursor-pointer text-[#F9FAFB] text-xs md:text-sm">Overall Score</TableHead>
                    <TableHead className="text-[#F9FAFB] text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id} className="hover:bg-[#374151] cursor-pointer">
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{new Date(analysis.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.company}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.role}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">{analysis.mockInterviewer}</TableCell>
                      <TableCell className="text-[#F9FAFB] py-2 text-xs md:text-sm">
                        <div className="flex items-center">
                          {getScoreIcon(analysis.overallScore)}
                          <span className="ml-2">{analysis.overallScore}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex space-x-1 md:space-x-2">
                          <Link href={`/post-interview-analysis/${analysis.id}`}>
                            <Button variant="ghost" size="sm" className="p-1 md:p-2">
                              <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#10B981]" />
                            </Button>
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1 md:p-2">
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#252b3b] text-[#F9FAFB]">
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription className="text-[#D1D5DB]">
                                  Are you sure you want to delete this interview analysis? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {}} className="text-[#F9FAFB] border-[#F9FAFB]">Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDelete(analysis.id)} className="bg-red-500 text-[#F9FAFB]">Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
      <Footer />
    </div>
  )
}