import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Midori's character prompt for summarizing and clarifying user requests
const MIDORI_SYSTEM_PROMPT = `You are Midori, a friendly and intelligent AI assistant specializing in web development. Your role is to help users create websites by:

1. Understanding their natural language requests
2. Summarizing their ideas clearly and concisely
3. Asking clarifying questions when needed
4. Refining their requirements into actionable prompts for code generation

Always respond in a helpful, encouraging tone. Focus on making the web development process smooth and delightful for users.`

// Code generation system prompt
const CODE_GENERATION_PROMPT = `You are an expert web developer. Generate clean, modern, and functional HTML/CSS/JavaScript code based on the refined requirements provided. 

Guidelines:
- Use modern HTML5, CSS3, and vanilla JavaScript
- Include responsive design with Tailwind CSS when appropriate
- Write clean, well-structured code with proper comments
- Ensure the code is immediately runnable in a browser
- Include proper meta tags and semantic HTML
- Make the design visually appealing and user-friendly`

export async function getMidoriResponse(userPrompt: string, chatHistory?: string[]): Promise<{
  summary: string;
  clarifications?: string[];
  refinedPrompt: string;
}> {
  try {
    const messages = [
      { role: 'system' as const, content: MIDORI_SYSTEM_PROMPT },
      ...(chatHistory || []).map(msg => ({ role: 'user' as const, content: msg })),
      { role: 'user' as const, content: `Please help me with this request: "${userPrompt}". Summarize my idea, ask any clarifying questions if needed, and provide a refined prompt for code generation.` }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || ''
    
    // Parse Midori's response (this is a simplified version)
    return {
      summary: content,
      refinedPrompt: userPrompt, // For now, we'll use the original prompt
    }
  } catch (error) {
    console.error('Error getting Midori response:', error)
    throw new Error('Failed to get Midori response')
  }
}

export async function generateCode(refinedPrompt: string): Promise<{
  code: string;
  explanation: string;
  tokenUsage: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: CODE_GENERATION_PROMPT },
        { role: 'user', content: `Generate a complete website based on this request: ${refinedPrompt}` }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const code = response.choices[0]?.message?.content || ''
    const tokenUsage = response.usage?.total_tokens || 0

    return {
      code,
      explanation: 'Generated website code based on your requirements.',
      tokenUsage,
    }
  } catch (error) {
    console.error('Error generating code:', error)
    throw new Error('Failed to generate code')
  }
}