import BaseRequestClerk from '~/lib/tools/request-clerk/BaseRequestClerk.js'
import XMLHttpRequestClerk from '~/lib/tools/request-clerk/concretes/XMLHttpRequestClerk.js'

describe('XMLHttpRequestClerk', () => {
  describe('inheritance', () => {
    test('to extend BaseRequestClerk', () => {
      const clerk = XMLHttpRequestClerk.create({
        request: new Request('https://example.com/alpha'),
      })

      expect(clerk)
        .toBeInstanceOf(BaseRequestClerk)
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.createXMLHttpRequest()', () => {
    describe('should create XMLHttpRequest of the config', () => {
      const cases = [
        {
          config: {
            timeout: 3000,
            responseType: 'blob',
            withCredentials: true,
          },
        },
        {
          config: {
            timeout: 0,
            responseType: '',
            withCredentials: false,
          },
        },
      ]

      test.each(cases)('config: $config', ({ config }) => {
        const actual = XMLHttpRequestClerk.createXMLHttpRequest(
          /** @type {import('~/lib/tools/request-clerk/BaseRequestClerk.js').RequestClerkConfig} */ (config)
        )

        expect(actual)
          .toBeInstanceOf(XMLHttpRequest)
        expect(actual)
          .toHaveProperty('timeout', config.timeout)
        expect(actual)
          .toHaveProperty('responseType', config.responseType)
        expect(actual)
          .toHaveProperty('withCredentials', config.withCredentials)
      })
    })

    describe('should create a new instance on every call', () => {
      test('with the same config', () => {
        const config = {
          timeout: 0,
          responseType: /** @type {XMLHttpRequestResponseType} */ (''),
          withCredentials: false,
        }

        const first = XMLHttpRequestClerk.createXMLHttpRequest(config)
        const second = XMLHttpRequestClerk.createXMLHttpRequest(config)

        expect(first)
          .not
          .toBe(second)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.buildRequestBody()', () => {
    describe('when method does not send a body', () => {
      const cases = [
        {
          method: 'GET',
        },
        {
          method: 'DELETE',
        },
        {
          method: 'HEAD',
        },
      ]

      test.each(cases)('method: $method', async ({ method }) => {
        const actual = await XMLHttpRequestClerk.buildRequestBody({
          request: new Request('https://example.com/alpha', {
            method,
          }),
        })

        expect(actual)
          .toBeNull()
      })
    })

    describe('when method sends a body', () => {
      const cases = [
        {
          method: 'POST',
          body: '{"first":"alpha"}',
        },
        {
          method: 'put',
          body: '{"second":"beta"}',
        },
        {
          method: 'PATCH',
          body: '{"third":"gamma"}',
        },
      ]

      test.each(cases)('method: $method', async ({ method, body }) => {
        const actual = await XMLHttpRequestClerk.buildRequestBody({
          request: new Request('https://example.com/alpha', {
            method,
            body,
          }),
        })

        expect(actual)
          .toBeInstanceOf(Blob)
        expect(await actual?.text())
          .toBe(body)
      })
    })

    describe('should leave the given request unread', () => {
      test('with a POST body', async () => {
        const request = new Request('https://example.com/alpha', {
          method: 'POST',
          body: '{}',
        })

        await XMLHttpRequestClerk.buildRequestBody({
          request,
        })

        expect(request.bodyUsed)
          .toBe(false)
      })
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.isBodyRequiredMethod()', () => {
    const cases = [
      {
        method: 'POST',
        expected: true,
      },
      {
        method: 'PUT',
        expected: true,
      },
      {
        method: 'PATCH',
        expected: true,
      },
      {
        method: 'GET',
        expected: false,
      },
      {
        method: 'DELETE',
        expected: false,
      },
    ]

    test.each(cases)('method: $method', ({ method, expected }) => {
      const actual = XMLHttpRequestClerk.isBodyRequiredMethod({
        request: new Request('https://example.com/alpha', {
          method,
        }),
      })

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('.isNullBodyStatus()', () => {
    const cases = [
      {
        status: 101,
        expected: true,
      },
      {
        status: 103,
        expected: true,
      },
      {
        status: 204,
        expected: true,
      },
      {
        status: 205,
        expected: true,
      },
      {
        status: 304,
        expected: true,
      },
      {
        status: 200,
        expected: false,
      },
      {
        status: 404,
        expected: false,
      },
      {
        status: 500,
        expected: false,
      },
    ]

    test.each(cases)('status: $status', ({ status, expected }) => {
      const actual = XMLHttpRequestClerk.isNullBodyStatus({
        status,
      })

      expect(actual)
        .toBe(expected)
    })
  })
})

describe('XMLHttpRequestClerk', () => {
  describe('#get:Ctor', () => {
    test('to be constructor of own class', () => {
      const clerk = XMLHttpRequestClerk.create({
        request: new Request('https://example.com/alpha'),
      })

      expect(clerk.Ctor)
        .toBe(XMLHttpRequestClerk)
    })
  })
})
