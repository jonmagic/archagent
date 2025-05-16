import { describe, it, expect, vi } from 'vitest'

describe('summarizeFile', () => {
  it('returns JSON with the correct structure', async () => {
    vi.resetModules()
    await vi.doMock('@inngest/agent-kit', () => ({
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
                      { name: 'another_method', description: 'Mocked method 2.' },
                    ],
                  },
                ],
              }),
            },
          ],
        }),
      }),
    }))
    const { summarizeFile } = await import('../src/index')
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
    const result = await summarizeFile(sourceCode)

    // Test the structure with type-checking
    expect(result).toEqual({
      language: 'ruby',
      classes: [
        {
          name: 'SomeClass',
          description: 'A mock class for testing.',
          functions: [
            { name: 'some_method', description: 'Mocked method 1.' },
            { name: 'another_method', description: 'Mocked method 2.' },
          ],
        },
      ],
    })

    // You can also add specific assertions
    expect(result.classes.length).toBeGreaterThan(0)
    expect(result.classes[0].functions.length).toBe(2)
  })
})

describe('mapCodebase', () => {
  it('returns an array of summaries for each file', async () => {
    vi.resetModules()
    await vi.doMock('@inngest/agent-kit', () => {
      const outputs = [
        {
          type: 'text',
          content: JSON.stringify({
            classes: [
              {
                description:
                  'A React context provider component that supplies data and methods from EngineV1 to its descendants.',
                functions: [
                  {
                    description: 'Initializes the DataProvider with props and state.',
                    name: 'constructor',
                  },
                  {
                    description:
                      'Lifecycle method that executes after the component mounts; sets up data listeners and initializes state as needed.',
                    name: 'componentDidMount',
                  },
                  {
                    description:
                      'Lifecycle method that executes before the component unmounts; cleans up listeners or any ongoing subscriptions.',
                    name: 'componentWillUnmount',
                  },
                  {
                    description:
                      'Renders the children wrapped in the EngineV1 data context, providing access to data and methods.',
                    name: 'render',
                  },
                ],
                name: 'DataProvider',
              },
            ],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/DataProvider.tsx',
            language: 'typescript',
          }),
        },
        {
          type: 'text',
          content: JSON.stringify({
            classes: [
              {
                description:
                  'A React component that serves as a layout wrapper for application content, providing structure with header, sidebar, and content areas. It manages header state, loading overlay, and sidebar toggling.',
                functions: [
                  {
                    description:
                      'Initializes the Frame component with props and sets up initial state.',
                    name: 'constructor',
                  },
                  {
                    description: 'Sets the header with a given title and optional actions.',
                    name: 'setHeader',
                  },
                  {
                    description: 'Clears the header, removing title and actions.',
                    name: 'clearHeader',
                  },
                  { description: 'Toggles the visibility of the sidebar.', name: 'toggleSidebar' },
                  { description: 'Displays the loading overlay.', name: 'showLoading' },
                  { description: 'Hides the loading overlay.', name: 'hideLoading' },
                  {
                    description:
                      'Renders the Frame component layout including header, sidebar, loading overlay, and main content.',
                    name: 'render',
                  },
                ],
                name: 'Frame',
              },
            ],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/Frame.tsx',
            language: 'typescript',
          }),
        },
        {
          type: 'text',
          content: JSON.stringify({
            classes: [],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/README.md',
            language: 'Markdown',
          }),
        },
        {
          type: 'text',
          content: JSON.stringify({
            classes: [
              {
                description:
                  'Handles the rendering configuration for the application, including initializing and updating rendering options.',
                functions: [
                  {
                    description:
                      'Initializes the RenderConfig instance with default or provided options.',
                    name: 'constructor',
                  },
                  {
                    description: 'Sets up rendering parameters and applies initial configuration.',
                    name: 'initialize',
                  },
                  {
                    description: 'Updates the rendering configuration with new parameters.',
                    name: 'updateConfig',
                  },
                  {
                    description: 'Resets the rendering configuration to its default values.',
                    name: 'resetToDefaults',
                  },
                ],
                name: 'RenderConfig',
              },
            ],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/RenderConfig.tsx',
            language: 'typescript',
          }),
        },
        {
          type: 'text',
          content: JSON.stringify({
            classes: [
              {
                description: 'A custom error class for configuration-related errors.',
                functions: [
                  {
                    description:
                      'Initializes a new instance of ConfigurationError with a specific message.',
                    name: 'constructor',
                  },
                ],
                name: 'ConfigurationError',
              },
            ],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/config-schemas.tsx',
            language: 'TypeScript',
          }),
        },
        {
          type: 'text',
          content: JSON.stringify({
            classes: [
              {
                description:
                  'Engine for managing and applying V1 configuration rules to Open Truss. Handles loading, validation, and retrieval of configuration data.',
                functions: [
                  {
                    description:
                      'Initializes a new instance of ConfigurationEngineV1 with given configuration data.',
                    name: 'constructor',
                  },
                  {
                    description:
                      'Validates the configuration against the V1 schema and internal rules.',
                    name: 'validate',
                  },
                  {
                    description: 'Retrieves a configuration value based on a provided path or key.',
                    name: 'get',
                  },
                  {
                    description: 'Sets a configuration value at a specified path or key.',
                    name: 'set',
                  },
                  {
                    description:
                      'Checks if a configuration key or path exists in the current configuration.',
                    name: 'has',
                  },
                  {
                    description: 'Resets the configuration to its default or initial state.',
                    name: 'reset',
                  },
                ],
                name: 'ConfigurationEngineV1',
              },
            ],
            filePath: 'tests/fixtures/open-truss/configuration/engine-v1/index.ts',
            language: 'TypeScript',
          }),
        },
      ]
      return {
        openai: () => ({
          model: 'mock-model',
        }),
        createAgent: () => ({
          /** If you see an error like this you haven't mocked every file that is being read by mapCodebase walk.
           *
           * SyntaxError: Unexpected end of JSON input
           * ❯ summarizeFile src/index.ts:49:15
           *     47|   const lastMessage = output[output.length - 1]
           *     48|   const content = lastMessage?.type === 'text' ? (lastMessage?.content as string) : ''
           *     49|   return JSON.parse(content)
           */
          run: vi.fn().mockImplementation(() => Promise.resolve({ output: [outputs.shift()] })),
        }),
      }
    })
    const { mapCodebase } = await import('../src/index')
    const result = await mapCodebase('tests/fixtures/open-truss')
    // Only test for the first file summary, ignore extra files
    expect(result).toEqual({
      files: [
        {
          classes: [
            {
              description:
                'A React context provider component that supplies data and methods from EngineV1 to its descendants.',
              functions: [
                {
                  description: 'Initializes the DataProvider with props and state.',
                  name: 'constructor',
                },
                {
                  description:
                    'Lifecycle method that executes after the component mounts; sets up data listeners and initializes state as needed.',
                  name: 'componentDidMount',
                },
                {
                  description:
                    'Lifecycle method that executes before the component unmounts; cleans up listeners or any ongoing subscriptions.',
                  name: 'componentWillUnmount',
                },
                {
                  description:
                    'Renders the children wrapped in the EngineV1 data context, providing access to data and methods.',
                  name: 'render',
                },
              ],
              name: 'DataProvider',
            },
          ],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/DataProvider.tsx',
          language: 'typescript',
        },
        {
          classes: [
            {
              description:
                'A React component that serves as a layout wrapper for application content, providing structure with header, sidebar, and content areas. It manages header state, loading overlay, and sidebar toggling.',
              functions: [
                {
                  description:
                    'Initializes the Frame component with props and sets up initial state.',
                  name: 'constructor',
                },
                {
                  description: 'Sets the header with a given title and optional actions.',
                  name: 'setHeader',
                },
                {
                  description: 'Clears the header, removing title and actions.',
                  name: 'clearHeader',
                },
                {
                  description: 'Toggles the visibility of the sidebar.',
                  name: 'toggleSidebar',
                },
                {
                  description: 'Displays the loading overlay.',
                  name: 'showLoading',
                },
                {
                  description: 'Hides the loading overlay.',
                  name: 'hideLoading',
                },
                {
                  description:
                    'Renders the Frame component layout including header, sidebar, loading overlay, and main content.',
                  name: 'render',
                },
              ],
              name: 'Frame',
            },
          ],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/Frame.tsx',
          language: 'typescript',
        },
        {
          classes: [],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/README.md',
          language: 'Markdown',
        },
        {
          classes: [
            {
              description:
                'Handles the rendering configuration for the application, including initializing and updating rendering options.',
              functions: [
                {
                  description:
                    'Initializes the RenderConfig instance with default or provided options.',
                  name: 'constructor',
                },
                {
                  description: 'Sets up rendering parameters and applies initial configuration.',
                  name: 'initialize',
                },
                {
                  description: 'Updates the rendering configuration with new parameters.',
                  name: 'updateConfig',
                },
                {
                  description: 'Resets the rendering configuration to its default values.',
                  name: 'resetToDefaults',
                },
              ],
              name: 'RenderConfig',
            },
          ],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/RenderConfig.tsx',
          language: 'typescript',
        },
        {
          classes: [
            {
              description: 'A custom error class for configuration-related errors.',
              functions: [
                {
                  description:
                    'Initializes a new instance of ConfigurationError with a specific message.',
                  name: 'constructor',
                },
              ],
              name: 'ConfigurationError',
            },
          ],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/config-schemas.tsx',
          language: 'TypeScript',
        },
        {
          classes: [
            {
              description:
                'Engine for managing and applying V1 configuration rules to Open Truss. Handles loading, validation, and retrieval of configuration data.',
              functions: [
                {
                  description:
                    'Initializes a new instance of ConfigurationEngineV1 with given configuration data.',
                  name: 'constructor',
                },
                {
                  description:
                    'Validates the configuration against the V1 schema and internal rules.',
                  name: 'validate',
                },
                {
                  description: 'Retrieves a configuration value based on a provided path or key.',
                  name: 'get',
                },
                {
                  description: 'Sets a configuration value at a specified path or key.',
                  name: 'set',
                },
                {
                  description:
                    'Checks if a configuration key or path exists in the current configuration.',
                  name: 'has',
                },
                {
                  description: 'Resets the configuration to its default or initial state.',
                  name: 'reset',
                },
              ],
              name: 'ConfigurationEngineV1',
            },
          ],
          filePath: 'tests/fixtures/open-truss/configuration/engine-v1/index.ts',
          language: 'TypeScript',
        },
      ],
    })
  })
})
