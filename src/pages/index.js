'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /chatbot after the component mounts
    router.push('/chatbot')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h1 className="text-5xl font-bold">Redirecting...</h1>
    </div>
  )
}
