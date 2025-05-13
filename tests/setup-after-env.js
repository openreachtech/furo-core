import {
  jest as jestGlobal,
} from '@jest/globals'

import Spy from '@openreachtech/jest-constructor-spy'

const {
  ConstructorSpy,
} = Spy

/*
 * Set global variables.
 */
globalThis.jest = jestGlobal
globalThis.constructorSpy = ConstructorSpy.create({
  jest: jestGlobal,
})

/*
 * Set global hooks.
 */
afterEach(() => {
  jest.restoreAllMocks()
})
