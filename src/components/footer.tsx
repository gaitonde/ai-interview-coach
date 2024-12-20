'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-[#D1D5DB] p-4 w-full mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <p className="text-sm">&copy; 2025 The Interview Playbook. All rights reserved.</p>
        <Link href="/terms" className="text-sm hover:text-[#10B981] transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm hover:text-[#10B981] transition-colors">
          Privacy Policy
        </Link>
        <Link href="https://forms.gle/tmUykr1ir5VuwHXZ8" className="text-sm hover:text-[#10B981] transition-colors" target="_blank">
          Feedback Form
        </Link>
      </div>
    </footer>
  )
}