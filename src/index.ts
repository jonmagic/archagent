import dotenv from 'dotenv'
import { createAgent, openai } from '@inngest/agent-kit'

dotenv.config()

const agent = createAgent({
  name: 'Code Analyzer',
  description: 'Analyzes code to extract class and function names',
  system: `You are a software engineer that analyzes a single file with code to extract information.
1. Determine the source file language to parse the code for class and function names.
2. Follow the language's grammar to extract classes and their methods.
3. For each class, include:
   - name: the class name
   - description: a brief summary of what the class does
   - functions: an array of its functions, each with:
       - name: the function name
       - description: a brief summary of what the function does
4. Output JSON exactly as follows:

{
  "language": "<language>",
  "classes": [
    {
      "name": "<className>",
      "description": "<classDescription>",
      "functions": [
        {
          "name": "<functionName>",
          "description": "<functionDescription>"
        }
      ]
    }
  ]
}

Return only the JSON object with no additional explanation.`,
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
