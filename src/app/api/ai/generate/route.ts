import { NextRequest, NextResponse } from 'next/server'
import { generateCode } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const response = await generateCode(prompt)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in code generation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}