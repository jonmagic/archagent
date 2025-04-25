import { describe, it, expect } from 'vitest'
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
