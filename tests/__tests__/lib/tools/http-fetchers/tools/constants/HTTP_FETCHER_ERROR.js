import { HTTP_FETCHER_ERROR } from '../../../../../../../lib/tools/http-fetchers/tools/constants/HTTP_FETCHER_ERROR.js'

describe('HTTP_FETCHER_ERROR', () => {
  describe('named export', () => {
    describe('as HTTP_FETCHER_ERROR', () => {
      describe('when imported', () => {
        const cases = [
          {
            input: {
              memberName: 'NETWORK',
            },
            expected: 'network',
          },
          {
            input: {
              memberName: 'TIMEOUT',
            },
            expected: 'timeout',
          },
          {
            input: {
              memberName: 'ABORT',
            },
            expected: 'abort',
          },
          {
            input: {
              memberName: 'UNKNOWN',
            },
            expected: 'unknown',
          },
        ]

        describe('should hold a symbol in each member', () => {
          test.each(cases)('memberName: $input.memberName', ({ input }) => {
            const member = HTTP_FETCHER_ERROR[input.memberName]
            const received = typeof member

            expect(received)
              .toBe('symbol')
          })
        })

        describe('should describe each symbol with the name of the error', () => {
          test.each(cases)('memberName: $input.memberName', ({ input, expected }) => {
            const member = HTTP_FETCHER_ERROR[input.memberName]
            const received = member.description

            expect(received)
              .toBe(expected)
          })
        })

        describe('should hold a symbol that no other member holds', () => {
          test('should be unique across the members', () => {
            const received = [
              HTTP_FETCHER_ERROR.NETWORK,
              HTTP_FETCHER_ERROR.TIMEOUT,
              HTTP_FETCHER_ERROR.ABORT,
              HTTP_FETCHER_ERROR.UNKNOWN,
            ]

            expect(received)
              .toHaveLength(4)
            expect(received)
              .not
              .toContain(Symbol('network'))
          })
        })
      })
    })
  })
})
