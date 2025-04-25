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
  it('returns JSON with the classes and functions', async () => {
    const expected = {
      language: 'Ruby',
      classes: ['SomeClass'],
      functions: ['some_method', 'another_method'],
    }
    expect(await analyzeSourceCode(sourceCode)).toBe(JSON.stringify(expected, null, 2))
  })
})
