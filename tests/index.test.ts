import { describe, it, expect, vi } from 'vitest'

// Mock @inngest/agent-kit before importing your code
vi.mock('@inngest/agent-kit', () => {
  return {
    openai: () => ({
      model: 'mock-model',
    }),
    createAgent: () => ({
      run: async () => ({
        output: [
          {
            type: 'text',
            content: JSON.stringify({
              language: 'ruby',
              classes: [
                {
                  name: 'SomeClass',
                  description: 'A mock class for testing.',
                  functions: [
                    { name: 'some_method', description: 'Mocked method 1.' },
                    { name: 'another_method', description: 'Mocked method 2.' }
                  ]
                }
              ]
            })
          }
        ]
      })
    })
  }
})

const { analyzeSourceCode } = await import('../src/index')

const sourceCode = `
class SomeClass
  def some_method
    puts "Hello, world!"
  end

  def another_method
    puts "This is another method."
  end
end
`.trim()

describe('analyzeSourceCode', () => {
  it('returns JSON with the correct structure', async () => {
    const result = JSON.parse(await analyzeSourceCode(sourceCode))

    // Test the structure with type-checking
    expect(result).toEqual(expect.objectContaining({
      language: expect.any(String),
      classes: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          functions: expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String)
            })
          ])
        })
      ])
    }))

    // You can also add specific assertions
    expect(result.classes.length).toBeGreaterThan(0)
    expect(result.classes[0].functions.length).toBe(2)
  })
})
