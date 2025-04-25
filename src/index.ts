import dotenv from 'dotenv'
import { createAgent, openai } from '@inngest/agent-kit'

dotenv.config()

const agent = createAgent({
  name: 'Code Analyzer',
  description: 'Analyzes code to extract class and function names',
  system: `You are a software engineer that analyzes a single file with code to extract information.
1. Determine the source file language so that you can better parse the code for class and function names.
2. Follow that languages grammar to extract the classes and functions.
3. Output JSON with the following structure:

{
  "language": <language>,
  "classes": <array of classes>,
  "functions": <array of function>
}
`,
  model: openai({
    model: 'gpt-4.1',
    apiKey: process.env.OPENAI_API_KEY,
  }),
})

export async function analyzeSourceCode(sourceCode: string) {
  const { output } = await agent.run(sourceCode)
  const lastMessage = output[output.length - 1]
  const content = lastMessage?.type === 'text' ? (lastMessage?.content as string) : ''
  return content
}
