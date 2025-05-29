import {
  createClient,
} from 'graphql-ws'

import SubscriptionConnector from '../../../../lib/client/graphql/SubscriptionConnector.js'

describe('SubscriptionConnector', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      describe('#websocketClient', () => {
        const cases = /** @type {*} */ ([
          {
            params: {
              websocketClient: createClient({
                url: 'ws://localhost:8080/graphql-alpha',
              }),
            },
          },
          {
            params: {
              websocketClient: createClient({
                url: 'ws://localhost:8080/graphql-beta',
              }),
            },
          },
        ])

        test.each(cases)('websocketClient: $params.websocketClient', ({ params }) => {
          const args = {
            websocketClient: params.websocketClient,
            eventTarget: new EventTarget(),
          }
          const connector = new SubscriptionConnector(args)

          expect(connector)
            .toHaveProperty(
              'websocketClient',
              params.websocketClient
            )
        })
      })

      describe('#eventTarget', () => {
        const webSocketClientMock = createClient({
          url: 'ws://localhost:8080/graphql-alpha',
        })

        const alphaEventTarget = new EventTarget()
        const betaEventTarget = new EventTarget()

        alphaEventTarget.addEventListener('message', () => {})

        const cases = /** @type {*} */ ([
          {
            params: {
              eventTarget: alphaEventTarget,
            },
          },
          {
            params: {
              eventTarget: betaEventTarget,
            },
          },
        ])

        test.each(cases)('eventTarget: $params.eventTarget', ({ params }) => {
          const args = {
            websocketClient: webSocketClientMock,
            eventTarget: params.eventTarget,
          }
          const connector = new SubscriptionConnector(args)

          expect(connector)
            .toHaveProperty(
              'eventTarget',
              params.eventTarget
            )
        })
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-alpha',
            },
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-beta',
            },
          },
        },
      ]

      test.each(cases)('config: $params.config', ({ params }) => {
        const connector = SubscriptionConnector.create(params)

        expect(connector)
          .toBeInstanceOf(SubscriptionConnector)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-alpha',
            },
          },
          expected: {
            websocketClient: createClient({
              url: 'ws://localhost:8080/graphql-alpha',
            }),
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-beta',
            },
          },
          expected: {
            websocketClient: createClient({
              url: 'ws://localhost:8080/graphql-beta',
            }),
          },
        },
      ]

      test.each(cases)('config: $params.config', ({ params }) => {
        const expected = {
          websocketClient: {
            dispose: expect.any(Function),
            iterate: expect.any(Function),
            on: expect.any(Function),
            subscribe: expect.any(Function),
            terminate: expect.any(Function),
          },
          eventTarget: expect.any(EventTarget),
        }

        const SpyClass = globalThis.constructorSpy.spyOn(SubscriptionConnector)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('.createEventTarget()', () => {
    describe('to be fixed value', () => {
      test('as instance of EventTarget', () => {
        const eventTarget = SubscriptionConnector.createEventTarget()

        expect(eventTarget)
          .toBeInstanceOf(EventTarget)
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('.createCustomEvent()', () => {
    describe('to be instance of CustomEvent', () => {
      const cases = [
        {
          params: {
            eventName: 'alpha',
            detail: {
              message: 'Hello World',
            },
          },
          expected: new CustomEvent('alpha', {
            detail: {
              message: 'Hello World',
            },
          }),
        },
        {
          params: {
            eventName: 'beta',
            detail: {
              message: 'Goodbye World',
            },
          },
          expected: new CustomEvent('beta', {
            detail: {
              message: 'Goodbye World',
            },
          }),
        },
      ]

      test.each(cases)('eventName: $params.eventName', ({ params, expected }) => {
        const customEvent = SubscriptionConnector.createCustomEvent(params)

        expect(customEvent)
          .toEqual(expected)
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('.generateWebSocketSink()', () => {
    describe('to be fixed object', () => {
      const alphaEventTarget = new EventTarget()
      const betaEventTarget = new EventTarget()

      const cases = [
        {
          title: 'alpha event target',
          params: {
            eventTarget: alphaEventTarget,
          },
        },
        {
          title: 'beta event target',
          params: {
            eventTarget: betaEventTarget,
          },
        },
      ]

      test.each(cases)('$params.title', ({ params }) => {
        const expected = {
          connecting: expect.any(Function),
          opened: expect.any(Function),
          message: expect.any(Function),
          connected: expect.any(Function),
          closed: expect.any(Function),
          error: expect.any(Function),
          ping: expect.any(Function),
          pong: expect.any(Function),
        }

        const sink = SubscriptionConnector.generateWebSocketSink(params)

        expect(sink)
          .toEqual(expected)
      })
    })

    describe('to call EventTarget#dispatchEvent()', () => {
      const alphaEventTarget = new EventTarget()
      const betaEventTarget = new EventTarget()

      const eventTargetCases = [
        {
          title: 'alpha event target',
          params: {
            eventTarget: alphaEventTarget,
          },
        },
        {
          title: 'beta event target',
          params: {
            eventTarget: betaEventTarget,
          },
        },
      ]

      describe.each(eventTargetCases)('$params.title', ({ params }) => {
        const sink = SubscriptionConnector.generateWebSocketSink(params)

        const eventCases = [
          {
            eventName: 'connecting',
            cases: [
              {
                detail: {
                  message: 'Alpha message on connecting',
                },
                expected: new CustomEvent('connecting', {
                  detail: {
                    message: 'Alpha message on connecting',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on connecting',
                },
                expected: new CustomEvent('connecting', {
                  detail: {
                    message: 'Beta message on connecting',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'opened',
            cases: [
              {
                detail: {
                  message: 'Alpha message on opened',
                },
                expected: new CustomEvent('opened', {
                  detail: {
                    message: 'Alpha message on opened',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on opened',
                },
                expected: new CustomEvent('opened', {
                  detail: {
                    message: 'Beta message on opened',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'message',
            cases: [
              {
                detail: {
                  message: 'Alpha message on message',
                },
                expected: new CustomEvent('message', {
                  detail: {
                    message: 'Alpha message on message',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on message',
                },
                expected: new CustomEvent('message', {
                  detail: {
                    message: 'Beta message on message',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'connected',
            cases: [
              {
                detail: {
                  message: 'Alpha message on connected',
                },
                expected: new CustomEvent('connected', {
                  detail: {
                    message: 'Alpha message on connected',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on connected',
                },
                expected: new CustomEvent('connected', {
                  detail: {
                    message: 'Beta message on connected',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'closed',
            cases: [
              {
                detail: {
                  message: 'Alpha message on closed',
                },
                expected: new CustomEvent('closed', {
                  detail: {
                    message: 'Alpha message on closed',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on closed',
                },
                expected: new CustomEvent('closed', {
                  detail: {
                    message: 'Beta message on closed',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'error',
            cases: [
              {
                detail: {
                  message: 'Alpha message on error',
                },
                expected: new CustomEvent('error', {
                  detail: {
                    message: 'Alpha message on error',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on error',
                },
                expected: new CustomEvent('error', {
                  detail: {
                    message: 'Beta message on error',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'ping',
            cases: [
              {
                detail: {
                  message: 'Alpha message on ping',
                },
                expected: new CustomEvent('ping', {
                  detail: {
                    message: 'Alpha message on ping',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on ping',
                },
                expected: new CustomEvent('ping', {
                  detail: {
                    message: 'Beta message on ping',
                  },
                }),
              },
            ],
          },
          {
            eventName: 'pong',
            cases: [
              {
                detail: {
                  message: 'Alpha message on pong',
                },
                expected: new CustomEvent('pong', {
                  detail: {
                    message: 'Alpha message on pong',
                  },
                }),
              },
              {
                detail: {
                  message: 'Beta message on pong',
                },
                expected: new CustomEvent('pong', {
                  detail: {
                    message: 'Beta message on pong',
                  },
                }),
              },
            ],
          },
        ]

        describe.each(eventCases)('eventName: $eventName', ({ eventName, cases }) => {
          test.each(cases)('detail: $detail', ({ detail, expected }) => {
            const expectedArgs = {
              eventName,
              detail,
            }

            const createCustomEventSpy = jest.spyOn(SubscriptionConnector, 'createCustomEvent')
            const dispatchEventSpy = jest.spyOn(params.eventTarget, 'dispatchEvent')

            const handler = sink[eventName]

            handler(detail)

            expect(createCustomEventSpy)
              .toHaveBeenCalledWith(expectedArgs)
            expect(dispatchEventSpy)
              .toHaveBeenCalledWith(expected)
          })
        })
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('.createWebSocketClient()', () => {
    describe('to be instance of Client', () => {
      const cases = [
        {
          params: {
            url: 'ws://localhost:8080/graphql-alpha',
            eventTarget: new EventTarget(),
          },
        },
        {
          params: {
            url: 'ws://localhost:8080/graphql-beta',
            eventTarget: new EventTarget(),
          },
        },
      ]

      test.each(cases)('url: $params.url', ({ params }) => {
        const expected = {
          dispose: expect.any(Function),
          iterate: expect.any(Function),
          on: expect.any(Function),
          subscribe: expect.any(Function),
          terminate: expect.any(Function),
        }

        const client = SubscriptionConnector.createWebSocketClient(params)

        expect(client)
          .toEqual(expected)
      })
    })

    describe('to call features', () => {
      const sinkTally = {
        connecting: expect.any(Function),
        opened: expect.any(Function),
        message: expect.any(Function),
        connected: expect.any(Function),
        closed: expect.any(Function),
        error: expect.any(Function),
        ping: expect.any(Function),
        pong: expect.any(Function),
      }

      const cases = [
        {
          params: {
            url: 'ws://localhost:8080/graphql-alpha',
            eventTarget: new EventTarget(),
          },
        },
        {
          params: {
            url: 'ws://localhost:8080/graphql-beta',
            eventTarget: new EventTarget(),
          },
        },
      ]

      test.each(cases)('url: $params.url', ({ params }) => {
        /**
         * @type {{
         *   createClient: (options: furo.WebSocketClientOptions) => furo.WebSocketClient
         * }}
         */
        const graphqlWsCoreMock = /** @type {*} */ ({
          createClient: options => {},
        })

        jest.spyOn(SubscriptionConnector, 'graphqlWsCore', 'get')
          .mockReturnValue(graphqlWsCoreMock)
        const generateWebSocketSinkSpy = jest.spyOn(SubscriptionConnector, 'generateWebSocketSink')
        const createClientSpy = jest.spyOn(graphqlWsCoreMock, 'createClient')

        const generateWebSocketSinkExpectedArgs = {
          eventTarget: params.eventTarget,
        }
        const createClientExpectedArgs = {
          url: params.url,
          retryAttempts: -1,
          on: sinkTally,
        }

        SubscriptionConnector.createWebSocketClient(params)

        expect(generateWebSocketSinkSpy)
          .toHaveBeenCalledWith(generateWebSocketSinkExpectedArgs)
        expect(createClientSpy)
          .toHaveBeenCalledWith(createClientExpectedArgs)
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('#addLifecycleListener()', () => {
    describe('to call EventTarget#addEventListener()', () => {
      const configCases = [
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-alpha',
            },
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-beta',
            },
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-gamma',
            },
          },
        },
      ]

      describe.each(configCases)('WEBSOCKET_URL: $params.config.WEBSOCKET_URL', ({ params }) => {
        const args = {
          config: params.config,
        }
        const connector = SubscriptionConnector.create(args)

        /**
         * @type {Array<{
         *   envelope: {
         *     eventName: string,
         *     handler: (event: *) => void
         *     options?: AddEventListenerOptions
         *   }
         *   expected: Array<*>
         * }>}
         */
        const cases = [
          {
            envelope: {
              eventName: 'alpha',
              handler: () => {},
              options: {
                once: true,
              },
            },
            expected: [
              'alpha',
              expect.any(Function),
              {
                once: true,
              },
            ],
          },
          {
            envelope: {
              eventName: 'beta',
              handler: () => {},
              options: {
                passive: true,
              },
            },
            expected: [
              'beta',
              expect.any(Function),
              {
                passive: true,
              },
            ],
          },
          {
            envelope: {
              eventName: 'gamma',
              handler: () => {},
              // options: {},
            },
            expected: [
              'gamma',
              expect.any(Function),
              {},
            ],
          },
        ]

        test.each(cases)('eventName: $envelope.envelope.eventName', ({ envelope, expected }) => {
          const addEventListenerSpy = jest.spyOn(connector.eventTarget, 'addEventListener')

          const actual = connector.addLifecycleListener(envelope)

          expect(actual)
            .toBeInstanceOf(SubscriptionConnector)

          expect(addEventListenerSpy)
            .toHaveBeenCalledWith(...expected)
        })
      })
    })
  })
})

describe('SubscriptionConnector', () => {
  describe('#removeLifecycleListener()', () => {
    describe('to call EventTarget#removeEventListener()', () => {
      const configCases = [
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-alpha',
            },
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-beta',
            },
          },
        },
        {
          params: {
            config: {
              WEBSOCKET_URL: 'ws://localhost:8080/graphql-gamma',
            },
          },
        },
      ]

      describe.each(configCases)('WEBSOCKET_URL: $params.config.WEBSOCKET_URL', ({ params }) => {
        const args = {
          config: params.config,
        }
        const connector = SubscriptionConnector.create(args)

        /**
         * @type {Array<{
         *   envelope: {
         *     eventName: string,
         *     handler: (event: *) => void
         *     options?: EventListenerOptions
         *   }
         *   expected: Array<*>
         * }>}
         */
        const cases = [
          {
            envelope: {
              eventName: 'alpha',
              handler: () => {},
              options: {
                capture: true,
              },
            },
            expected: [
              'alpha',
              expect.any(Function),
              {
                capture: true,
              },
            ],
          },
          {
            envelope: {
              eventName: 'beta',
              handler: () => {},
              options: {
                capture: false,
              },
            },
            expected: [
              'beta',
              expect.any(Function),
              {
                capture: false,
              },
            ],
          },
          {
            envelope: {
              eventName: 'gamma',
              handler: () => {},
              // options: {},
            },
            expected: [
              'gamma',
              expect.any(Function),
              {},
            ],
          },
        ]

        test.each(cases)('eventName: $envelope.envelope.eventName', ({ envelope, expected }) => {
          const removeEventListenerSpy = jest.spyOn(connector.eventTarget, 'removeEventListener')

          const actual = connector.removeLifecycleListener(envelope)

          expect(actual)
            .toBeInstanceOf(SubscriptionConnector)

          expect(removeEventListenerSpy)
            .toHaveBeenCalledWith(...expected)
        })
      })
    })
  })
})
