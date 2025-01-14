import { NextResponse } from 'next/server'

export async function GET() {
  // Simulating a backend delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return a random time between 10 and 60 seconds
  const progressTime = Math.floor(Math.random() * (60 - 10 + 1) + 10)
  
  return NextResponse.json({ progressTime })
}

