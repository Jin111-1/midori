import { NextRequest, NextResponse } from 'next/server'
import { getMidoriResponse } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const response = await getMidoriResponse(prompt, context ? [context] : undefined)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in Midori API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}