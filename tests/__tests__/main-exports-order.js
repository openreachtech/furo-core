import fs from 'node:fs'
import path from 'node:path'

describe('Order of exports in index.js', () => {
  const indexLines = fs.readFileSync(path.resolve(process.cwd(), 'index.js'), 'utf8')
    .split('\n')

  const exportLineIndexesOf = directoryName => indexLines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.startsWith('export ') && line.includes(`/${directoryName}/`))
    .map(({ index }) => index)

  const cases = [
    {
      requestDirectoryName: 'request-body-converter',
      responseDirectoryName: 'response-body-parser',
    },
  ]

  describe.each(cases)('$requestDirectoryName above $responseDirectoryName', ({ requestDirectoryName, responseDirectoryName }) => {
    const requestLineIndexes = exportLineIndexesOf(requestDirectoryName)
    const responseLineIndexes = exportLineIndexesOf(responseDirectoryName)

    test('should export both groups', () => {
      expect(requestLineIndexes)
        .not
        .toHaveLength(0)
      expect(responseLineIndexes)
        .not
        .toHaveLength(0)
    })

    test('should place every Request export above every Response export', () => {
      const lastRequestLineIndex = Math.max(...requestLineIndexes)
      const firstResponseLineIndex = Math.min(...responseLineIndexes)

      expect(lastRequestLineIndex)
        .toBeLessThan(firstResponseLineIndex)
    })
  })
})
