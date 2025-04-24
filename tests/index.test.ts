import { describe, it, expect } from 'vitest'
const { helloWorld } = await import('../src/index')

describe('helloWorld', () => {
  it('should return hello world', async () => {
    expect(helloWorld()).toBe('Hello, world!')
  })
})
