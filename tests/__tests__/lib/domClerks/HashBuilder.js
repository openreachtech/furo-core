import HashBuilder from '~/lib/domClerks/HashBuilder'

describe('HashBuilder', () => {
  describe('constructor', () => {
    describe('to keep property', () => {
      const cases = [
        {
          params: {
            core: {},
          },
        },
        {
          params: {
            core: [],
          },
        },
      ]

      test.each(cases)('core: $params.core', ({ params }) => {
        const builder = new HashBuilder(params)

        expect(builder)
          .toHaveProperty('core', params.core)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('.create()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            core: {},
          },
        },
        {
          params: {
            core: [],
          },
        },
      ]

      test.each(cases)('core: $params.core', ({ params }) => {
        const builder = HashBuilder.create(params)

        expect(builder)
          .toBeInstanceOf(HashBuilder)
      })

      test('with no params', () => {
        const builder = HashBuilder.create()

        expect(builder)
          .toBeInstanceOf(HashBuilder)
      })
    })

    describe('to call constructor', () => {
      const cases = [
        {
          params: {
            core: {},
          },
        },
        {
          params: {
            core: [],
          },
        },
      ]

      test.each(cases)('core: $params.core', ({ params }) => {
        const SpyClass = globalThis.constructorSpy.spyOn(HashBuilder)

        SpyClass.create(params)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(params)
      })

      test('with no params', () => {
        const expected = {
          core: {},
        }

        const SpyClass = globalThis.constructorSpy.spyOn(HashBuilder)

        SpyClass.create()

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#get:Ctor', () => {
    const cases = [
      {
        params: {
          core: {},
        },
      },
      {
        params: {
          core: [],
        },
      },
    ]

    test.each(cases)('core: $params.core', ({ params }) => {
      const builder = new HashBuilder(params)

      const actual = builder.Ctor

      expect(actual)
        .toBe(HashBuilder) // same reference
    })
  })
})

describe('HashBuilder', () => {
  describe('#createHashBuilder()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            core: {},
          },
        },
        {
          params: {
            core: [],
          },
        },
      ]

      test.each(cases)('core: $params.core', ({ params }) => {
        const builder = new HashBuilder(params)

        const actual = builder.createHashBuilder(params)

        expect(actual)
          .toBeInstanceOf(HashBuilder)
      })
    })

    describe('to call .create()', () => {
      const cases = [
        {
          params: {
            core: {},
          },
        },
        {
          params: {
            core: [],
          },
        },
      ]

      test.each(cases)('core: $params.core', ({ params }) => {
        const builder = new HashBuilder(params)

        const createSpy = jest.spyOn(HashBuilder, 'create')

        builder.createHashBuilder(params)

        expect(createSpy)
          .toHaveBeenCalledWith(params)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#createChildHashBuilder()', () => {
    describe('to be instance of own class', () => {
      const cases = [
        {
          params: {
            key: 'alpha',
          },
        },
        {
          params: {
            key: 'beta[]',
          },
        },
      ]

      test.each(cases)('key: $params.key', ({ params }) => {
        const builder = HashBuilder.create()

        const actual = builder.createChildHashBuilder(params)

        expect(actual)
          .toBeInstanceOf(HashBuilder)
      })
    })

    describe('to call .createHashBuilderSpy()', () => {
      const cases = [
        {
          params: {
            key: 'alpha',
          },
          expected: {
            core: {},
          },
        },
        {
          params: {
            key: 'beta[]',
          },
          expected: {
            core: [],
          },
        },
      ]

      test.each(cases)('key: $params.key', ({ params, expected }) => {
        const builder = HashBuilder.create()

        const createHashBuilderSpy = jest.spyOn(builder, 'createHashBuilder')

        builder.createChildHashBuilder(params)

        expect(createHashBuilderSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#resolveChildHash()', () => {
    describe('with plain core', () => {
      const cases = [
        {
          params: {
            core: {},
          },
          keyCases: [
            {
              key: 'alpha',
            },
            {
              key: 'beta[]',
            },
          ],
        },
        {
          params: {
            core: [],
          },
          keyCases: [
            {
              key: '0',
            },
            {
              key: '1',
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, keyCases }) => {
        const builder = HashBuilder.create(params)

        test.each(keyCases)('key: $key', ({ key }) => {
          const actual = builder.resolveChildHash({
            key,
          })

          expect(actual)
            .toBeInstanceOf(HashBuilder)
        })
      })
    })

    describe('with existing key', () => {
      const alphaCore = HashBuilder.create()
      const betaCore = HashBuilder.create({
        core: [],
      })

      const cases = [
        {
          params: {
            core: {
              alpha: alphaCore,
              'beta[]': betaCore,
            },
          },
          keyCases: [
            {
              key: 'alpha',
              expected: alphaCore,
            },
            {
              key: 'beta[]',
              expected: betaCore,
            },
          ],
          nonExistingKeyCases: [
            {
              key: 'gamma',
              expected: HashBuilder.create(),
            },
            {
              key: 'delta[]',
              expected: HashBuilder.create({
                core: [],
              }),
            },
          ],
        },
        {
          params: {
            core: [
              alphaCore,
              betaCore,
            ],
          },
          keyCases: [
            {
              key: '0',
              expected: alphaCore,
            },
            {
              key: '1',
              expected: betaCore,
            },
          ],
          nonExistingKeyCases: [
            {
              key: '2',
              expected: HashBuilder.create(),
            },
            {
              key: '3',
              expected: HashBuilder.create(),
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, keyCases, nonExistingKeyCases }) => {
        const builder = HashBuilder.create(params)

        test.each(keyCases)('key: $key', ({ key, expected }) => {
          const actual = builder.resolveChildHash({
            key,
          })

          expect(actual)
            .toBe(expected) // same reference
        })

        test.each(nonExistingKeyCases)('non-existing key: $key', ({ key, expected }) => {
          const actual = builder.resolveChildHash({
            key,
          })

          expect(actual)
            .not
            .toBe(alphaCore) // different reference
          expect(actual)
            .not
            .toBe(betaCore) // different reference

          expect(actual)
            .toEqual(expected)
        })
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#assignValueToCore()', () => {
    describe('to set new key', () => {
      const cases = [
        {
          params: {
            core: {},
          },
          assignCases: [
            {
              key: 'alpha',
              value: 'apple',
            },
            {
              key: 'beta',
              value: 'banana',
            },
          ],
        },
        {
          params: {
            core: [],
          },
          assignCases: [
            {
              key: '0',
              value: 'carrot',
            },
            {
              key: '1',
              value: 'durian',
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
        const builder = new HashBuilder(params)

        test.each(assignCases)('key: $key', ({ key, value }) => {
          builder.assignValueToCore({
            key,
            value,
          })

          expect(builder.core)
            .toHaveProperty(key, value)
        })
      })
    })

    describe('to set existing key', () => {
      const cases = [
        {
          params: {
            core: {
              alpha: 'apple',
              beta: 'banana',
            },
          },
          assignCases: [
            {
              key: 'alpha',
              value: 'new apple',
            },
            {
              key: 'beta',
              value: 'new banana',
            },
          ],
        },
        {
          params: {
            core: [
              'carrot',
              'durian',
            ],
          },
          assignCases: [
            {
              key: '0',
              value: 'new carrot',
            },
            {
              key: '1',
              value: 'new durian',
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
        const builder = new HashBuilder(params)

        test.each(assignCases)('key: $key', ({ key, value }) => {
          builder.assignValueToCore({
            key,
            value,
          })

          expect(builder.core)
            .toHaveProperty(key, value)
        })
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#extractValue()', () => {
    const alphaCore = HashBuilder.create()
    const betaCore = HashBuilder.create({
      core: [],
    })

    describe('to be presented value', () => {
      const cases = [
        {
          params: {
            core: {
              alpha: alphaCore,
              beta: betaCore,
              gamma: 'third',
            },
          },
          extractCases: [
            {
              key: 'alpha',
              value: alphaCore,
            },
            {
              key: 'beta',
              value: betaCore,
            },
            {
              key: 'gamma',
              value: 'third',
            },
          ],
        },
        {
          params: {
            core: [
              alphaCore,
              betaCore,
              'gamma',
            ],
          },
          extractCases: [
            {
              key: '0',
              value: alphaCore,
            },
            {
              key: '1',
              value: betaCore,
            },
            {
              key: '2',
              value: 'gamma',
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, extractCases }) => {
        const builder = new HashBuilder(params)

        test.each(extractCases)('key: $key', ({ key, value }) => {
          const actual = builder.extractValue({
            key,
          })

          expect(actual)
            .toBe(value) // same reference or value
        })
      })
    })

    describe('to be undefined', () => {
      const cases = [
        {
          params: {
            core: {
              alpha: alphaCore,
              beta: betaCore,
              gamma: 'third',
            },
          },
          extractCases: [
            {
              key: 'delta',
            },
            {
              key: 'epsilon',
            },
          ],
        },
        {
          params: {
            core: [
              alphaCore,
              betaCore,
              'gamma',
            ],
          },
          extractCases: [
            {
              key: '3',
            },
            {
              key: '4',
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, extractCases }) => {
        const builder = new HashBuilder(params)

        test.each(extractCases)('key: $key', ({ key }) => {
          const actual = builder.extractValue({
            key,
          })

          expect(actual)
            .toBeNull()
        })
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#fulfillHash()', () => {
    describe('to assign new HushBuilder', () => {
      /**
       * @type {Array<{
       *   params: {
       *     core: {} | []
       *   },
       *   assignCases: Array<{
       *     keysPath: string
       *     expected: *
       *   }>
       * }>}
       */
      const cases = [
        {
          params: {
            core: {},
          },
          assignCases: [
            {
              keysPath: 'alpha',
              expected: {
                alpha: HashBuilder.create(),
              },
            },
            {
              keysPath: 'beta[]',
              expected: {
                alpha: HashBuilder.create(),
                'beta[]': HashBuilder.create({
                  core: [],
                }),
              },
            },
            {
              keysPath: 'alpha.gamma',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create(),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [],
                }),
              },
            },
            {
              keysPath: 'alpha.gamma.first',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [],
                }),
              },
            },
            {
              keysPath: 'alpha.delta.second',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                    delta: HashBuilder.create({
                      core: {
                        second: HashBuilder.create(),
                      },
                    }),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [],
                }),
              },
            },
            {
              keysPath: 'beta[].0',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                    delta: HashBuilder.create({
                      core: {
                        second: HashBuilder.create(),
                      },
                    }),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [
                    HashBuilder.create(),
                  ],
                }),
              },
            },
            {
              keysPath: 'beta[].1.first',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                    delta: HashBuilder.create({
                      core: {
                        second: HashBuilder.create(),
                      },
                    }),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [
                    HashBuilder.create(),
                    HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                  ],
                }),
              },
            },
            {
              keysPath: 'beta[].2.second',
              expected: {
                alpha: HashBuilder.create({
                  core: {
                    gamma: HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                    delta: HashBuilder.create({
                      core: {
                        second: HashBuilder.create(),
                      },
                    }),
                  },
                }),
                'beta[]': HashBuilder.create({
                  core: [
                    HashBuilder.create(),
                    HashBuilder.create({
                      core: {
                        first: HashBuilder.create(),
                      },
                    }),
                    HashBuilder.create({
                      core: {
                        second: HashBuilder.create(),
                      },
                    }),
                  ],
                }),
              },
            },
          ],
        },
        {
          params: {
            core: [],
          },
          assignCases: [
            {
              keysPath: '0',
              expected: [
                HashBuilder.create(),
              ],
            },
            {
              keysPath: '1',
              expected: [
                HashBuilder.create(),
                HashBuilder.create(),
              ],
            },
            {
              keysPath: '0.alpha',
              expected: [
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create(),
                  },
                }),
                HashBuilder.create(),
              ],
            },
            {
              keysPath: '0.alpha.beta[]',
              expected: [
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create({
                      core: {
                        'beta[]': HashBuilder.create({
                          core: [],
                        }),
                      },
                    }),
                  },
                }),
                HashBuilder.create(),
              ],
            },
            {
              keysPath: '1.alpha.gamma[].0',
              expected: [
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create({
                      core: {
                        'beta[]': HashBuilder.create({
                          core: [],
                        }),
                      },
                    }),
                  },
                }),
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create({
                      core: {
                        'gamma[]': HashBuilder.create({
                          core: [
                            HashBuilder.create(),
                          ],
                        }),
                      },
                    }),
                  },
                }),
              ],
            },
            {
              keysPath: '1.alpha.gamma[].1.first',
              expected: [
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create({
                      core: {
                        'beta[]': HashBuilder.create({
                          core: [],
                        }),
                      },
                    }),
                  },
                }),
                HashBuilder.create({
                  core: {
                    alpha: HashBuilder.create({
                      core: {
                        'gamma[]': HashBuilder.create({
                          core: [
                            HashBuilder.create(),
                            HashBuilder.create({
                              core: {
                                first: HashBuilder.create(),
                              },
                            }),
                          ],
                        }),
                      },
                    }),
                  },
                }),
              ],
            },
          ],
        },
      ]

      describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
        const builder = new HashBuilder(params)

        test.each(assignCases)('keysPath: $keysPath', ({ keysPath, expected }) => {
          const actual = builder.fulfillHash({
            keysPath,
          })

          expect(actual)
            .toBe(builder) // same reference

          expect(builder)
            .toHaveProperty('core', expected)
        })
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#setValue()', () => {
    /**
     * @type {Array<{
     *   params: {
     *     core: {} | []
     *   },
     *   assignCases: Array<{
     *     input: {
     *       name: string
     *       value: *
     *     }
     *     expected: *
     *   }>
     * }>}
     */
    const cases = [
      {
        params: {
          core: {},
        },
        assignCases: [
          {
            input: {
              name: 'alpha.user.id',
              value: '10001',
            },
            expected: {
              alpha: HashBuilder.create({
                core: {
                  user: HashBuilder.create({
                    core: {
                      id: '10001',
                    },
                  }),
                },
              }),
            },
          },
          {
            input: {
              name: 'alpha.user.username',
              value: 'John Doe',
            },
            expected: {
              alpha: HashBuilder.create({
                core: {
                  user: HashBuilder.create({
                    core: {
                      id: '10001',
                      username: 'John Doe',
                    },
                  }),
                },
              }),
            },
          },
          {
            input: {
              name: 'alpha.tag[].0',
              value: 'tag01',
            },
            expected: {
              alpha: HashBuilder.create({
                core: {
                  user: HashBuilder.create({
                    core: {
                      id: '10001',
                      username: 'John Doe',
                    },
                  }),
                  'tag[]': HashBuilder.create({
                    core: [
                      'tag01',
                    ],
                  }),
                },
              }),
            },
          },
          {
            input: {
              name: 'alpha.tag[].1',
              value: 'tag02',
            },
            expected: {
              alpha: HashBuilder.create({
                core: {
                  user: HashBuilder.create({
                    core: {
                      id: '10001',
                      username: 'John Doe',
                    },
                  }),
                  'tag[]': HashBuilder.create({
                    core: [
                      'tag01',
                      'tag02',
                    ],
                  }),
                },
              }),
            },
          },
        ],
      },
      {
        params: {
          core: [],
        },
        assignCases: [
          {
            input: {
              name: '0.id',
              value: '20001',
            },
            expected: [
              HashBuilder.create({
                core: {
                  id: '20001',
                },
              }),
            ],
          },
          {
            input: {
              name: '0.username',
              value: 'Jane Smith',
            },
            expected: [
              HashBuilder.create({
                core: {
                  id: '20001',
                  username: 'Jane Smith',
                },
              }),
            ],
          },
          {
            input: {
              name: '1.id',
              value: '20002',
            },
            expected: [
              HashBuilder.create({
                core: {
                  id: '20001',
                  username: 'Jane Smith',
                },
              }),
              HashBuilder.create({
                core: {
                  id: '20002',
                },
              }),
            ],
          },
          {
            input: {
              name: '1.username',
              value: 'Jack Brown',
            },
            expected: [
              HashBuilder.create({
                core: {
                  id: '20001',
                  username: 'Jane Smith',
                },
              }),
              HashBuilder.create({
                core: {
                  id: '20002',
                  username: 'Jack Brown',
                },
              }),
            ],
          },
        ],
      },
    ]

    describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
      const builder = new HashBuilder(params)

      test.each(assignCases)('name: $input.name', ({ input, expected }) => {
        const actual = builder.setValue({
          name: input.name,
          value: input.value,
        })

        expect(actual)
          .toBe(builder) // same reference

        expect(builder)
          .toHaveProperty('core', expected)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#setValues()', () => {
    /**
     * @type {Array<{
     *   params: {
     *     core: {} | []
     *   },
     *   assignCases: Array<{
     *     values: Array<[string, *]>
     *     expected: *
     *   }>
     * }>}
     */
    const cases = [
      {
        params: {
          core: {},
        },
        assignCases: [
          {
            values: [
              ['alpha.user.id', '10001'],
              ['alpha.user.username', 'John Doe'],
              ['alpha.tag[].0', 'tag01'],
              ['alpha.tag[].1', 'tag02'],
            ],
            expected: {
              alpha: HashBuilder.create({
                core: {
                  user: HashBuilder.create({
                    core: {
                      id: '10001',
                      username: 'John Doe',
                    },
                  }),
                  'tag[]': HashBuilder.create({
                    core: [
                      'tag01',
                      'tag02',
                    ],
                  }),
                },
              }),
            },
          },
        ],
      },
      {
        params: {
          core: [],
        },
        assignCases: [
          {
            values: [
              ['0.id', '20001'],
              ['0.username', 'Jane Smith'],
              ['1.id', '20002'],
              ['1.username', 'Jack Brown'],
            ],
            expected: [
              HashBuilder.create({
                core: {
                  id: '20001',
                  username: 'Jane Smith',
                },
              }),
              HashBuilder.create({
                core: {
                  id: '20002',
                  username: 'Jack Brown',
                },
              }),
            ],
          },
        ],
      },
    ]

    describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
      const builder = new HashBuilder(params)

      test.each(assignCases)('values: $values', ({ values, expected }) => {
        const actual = builder.setValues({
          values,
        })

        expect(actual)
          .toBe(builder) // same reference

        expect(builder)
          .toHaveProperty('core', expected)
      })
    })
  })
})

describe('HashBuilder', () => {
  describe('#buildHash()', () => {
    /**
     * @type {Array<{
     *   params: {
     *     core: {} | []
     *   },
     *   assignCases: Array<{
     *     values: Array<[string, *]>
     *     expected: *
     *   }>
     * }>}
     */
    const cases = [
      {
        params: {
          core: {},
        },
        assignCases: [
          {
            values: [
              ['alpha.user.id', '10001'],
              ['alpha.user.username', 'John Doe'],
              ['alpha.tag[].0', 'tag01'],
              ['alpha.tag[].1', 'tag02'],
            ],
            expected: {
              alpha: {
                user: {
                  id: '10001',
                  username: 'John Doe',
                },
                tag: [
                  'tag01',
                  'tag02',
                ],
              },
            },
          },
        ],
      },
      {
        params: {
          core: [],
        },
        assignCases: [
          {
            values: [
              ['0.id', '20001'],
              ['0.username', 'Jane Smith'],
              ['1.id', '20002'],
              ['1.username', 'Jack Brown'],
            ],
            expected: [
              {
                id: '20001',
                username: 'Jane Smith',
              },
              {
                id: '20002',
                username: 'Jack Brown',
              },
            ],
          },
        ],
      },
    ]

    describe.each(cases)('core: $params.core', ({ params, assignCases }) => {
      const builder = new HashBuilder(params)

      test.each(assignCases)('values: $values', ({ values, expected }) => {
        const actual = builder
          .setValues({
            values,
          })
          .buildHash()

        expect(actual)
          .toEqual(expected)
      })
    })
  })
})
