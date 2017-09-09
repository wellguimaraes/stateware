import { getProxyContainer } from './getKeyInjector'
import { expect } from 'chai'

describe('getKeyInjector', () => {
  it('should create state proxy to set getter dependencies', () => {
    const someFn = function () {}
    someFn.updatedBy = {}

    const initialState = { a: 1, b: 2, '@@c'() { } }

    Object.defineProperty(initialState, 'c', {
      enumerable: false,
      get: () => 3
    })

    const proxy = getProxyContainer(someFn, initialState)

    expect(proxy.a).equals(1)
    expect(proxy.c).equals(3)
    expect(someFn.updatedBy.a).equals(true)
    expect(someFn.updatedBy.c).equals(true)
    expect(someFn.updatedBy.b).not.equals(true)
  })
})