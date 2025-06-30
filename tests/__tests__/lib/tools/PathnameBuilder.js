import PathnameBuilder from '../../../../lib/tools/PathnameBuilder.js'

describe('PathnameBuilder', () => {
  describe('constructor', () => {
    describe('should keep properties', () => {
      describe('#templatePathname', () => {
        const cases = [
          {
            input: {
              templatePathname: '/alpha/first',
            },
          },
          {
            input: {
              templatePathname: '/beta/second/[id]/[username]',
            },
          },
        ]

        test.each(cases)('templatePathname: $input.templatePathname', ({ input }) => {
          const builder = new PathnameBuilder(input)

          expect(builder)
            .toHaveProperty('templatePathname', input.templatePathname)
        })
      })
    })
  })
})

describe('PathnameBuilder', () => {
  describe('#buildPathname()', () => {
    describe('should return interpolated pathname', () => {
      /**
       * @type {Array<{
       *   input: {
       *     templatePathname: string
       *   },
       *   completedKeysCases: Array<{
       *     valueHash: Record<string, *>,
       *     expected: string
       *   }>
       *   lackedKeysCases: Array<{
       *     valueHash: Record<string, *>,
       *     expected: string
       *   }>
       * }>}
       */
      const inputCases = [
        {
          input: {
            templatePathname: '/alpha/[key]',
          },
          completedKeysCases: [
            {
              valueHash: {
                key: 'first',
              },
              expected: '/alpha/first',
            },
            {
              valueHash: {
                key: 'second',
              },
              expected: '/alpha/second',
            },
          ],
          lackedKeysCases: [
            {
              valueHash: {
                key: '',
              },
              expected: '/alpha/',
            },
            {
              valueHash: {
                // key: '',
              },
              expected: '/alpha/',
            },
          ],
        },
        {
          input: {
            templatePathname: '/beta/[id]/[username]',
          },
          completedKeysCases: [
            {
              valueHash: {
                id: 100001,
                username: 'JohnDoe',
              },
              expected: '/beta/100001/JohnDoe',
            },
            {
              valueHash: {
                id: 200002,
                username: 'JaneSmith',
              },
              expected: '/beta/200002/JaneSmith',
            },
            {
              valueHash: {
                id: 300003,
                username: 'AliceWonder',
              },
              expected: '/beta/300003/AliceWonder',
            },
            {
              valueHash: {
                id: 400004,
                username: 'BobBuilder',
              },
              expected: '/beta/400004/BobBuilder',
            },
            {
              valueHash: {
                id: 500005,
                username: 'CharlieBrown',
              },
              expected: '/beta/500005/CharlieBrown',
            },
          ],
          lackedKeysCases: [
            {
              valueHash: {
                // id: 100001,
                username: 'JohnDoe',
              },
              expected: '/beta//JohnDoe',
            },
            {
              valueHash: {
                id: 200002,
                // username: 'JaneSmith',
              },
              expected: '/beta/200002/',
            },
            {
              valueHash: {
                // id: 300003,
                // username: 'AliceWonder',
              },
              expected: '/beta//',
            },
            {
              valueHash: {
                id: '', // 400004
                username: 'BobBuilder',
              },
              expected: '/beta//BobBuilder',
            },
            {
              valueHash: {
                id: 500005,
                username: '', // CharlieBrown
              },
              expected: '/beta/500005/',
            },
          ],
        },
      ]

      describe.each(inputCases)('templatePathname: $input.templatePathname', ({ input, completedKeysCases, lackedKeysCases }) => {
        const builder = PathnameBuilder.create(input)

        describe('with completed keys value hash', () => {
          test.each(completedKeysCases)('valueHash: $valueHash', ({ valueHash, expected }) => {
            const actual = builder.buildPathname({
              valueHash,
            })

            expect(actual)
              .toBe(expected)
          })
        })

        describe('with lacked keys value hash', () => {
          test.each(lackedKeysCases)('valueHash: $valueHash', ({ valueHash, expected }) => {
            const actual = builder.buildPathname({
              valueHash,
            })

            expect(actual)
              .toBe(expected)
          })
        })
      })
    })
  })
})
