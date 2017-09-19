/**
 * Set cache value of a given key on a given state
 *
 * @param state
 * @param cacheKey
 * @param value
 */
export function setCacheValue(state, cacheKey, value) {
  Object.defineProperty(state, cacheKey, { enumerable: false, value })

  // decrement computations left
  state.__computationsLeft__--

  // if there's no more computations left
  // delete previous state to decrease memory usage
  if (state.__computationsLeft__ === 0)
    delete state.__previous__
}

/**
 * Compute a getter value and discover its dependencies
 *
 * @param state
 * @param getters
 * @param computedCacheKey
 * @param fn
 * @returns {*}
 */
export function computeValueAndDependencies(state, getters, computedCacheKey, fn) {
  const updatedBy = {}

  // Create a proxy object to discover a getter dependencies
  const discoveryProxy = Object
    .keys(state)
    .concat(getters)
    .reduce((acc, it) => {
      Object.defineProperty(acc, it, {
        get: () => {
          updatedBy[ it ] = true
          return state[ it ]
        }
      })
      return acc
    }, {})

  setCacheValue(
    state,
    computedCacheKey,
    fn.call(discoveryProxy, discoveryProxy)
  )

  fn.__updatedBy__ = Object.keys(updatedBy)

  return state[ computedCacheKey ]
}

/**
 * Create a memoized getter
 *
 * @param name
 * @param getters
 * @param fn
 * @returns {Function}
 */
export function createMemoizedGetter(name, getters, fn) {
  const cacheKey = '@@' + name
  const gettersKeys = Object.keys(getters)

  return function () {
    // If dependencies hasn't been discovered yet
    if (!fn.hasOwnProperty('__updatedBy__'))
      return computeValueAndDependencies(this, gettersKeys, cacheKey, fn)

    const didNotComputeYet = !this.hasOwnProperty(cacheKey)

    const shouldCompute = didNotComputeYet && (
      // has no previous state
      !this.hasOwnProperty('__previous__')

      // has no dependencies
      || fn.__updatedBy__.length === 0

      // some dependency has been updated
      || fn.__updatedBy__.some(key => this[ key ] !== this[ '__previous__' ][ key ])
    )

    if (shouldCompute)
      setCacheValue(this, cacheKey, fn.call(this, this))
    else if (didNotComputeYet)
      setCacheValue(this, cacheKey, this[ '__previous__' ][ name ])

    return this[ cacheKey ]
  }
}

/**
 * Create copier function
 *
 * @param numberOfGetters
 * @returns {Function}
 */
export function createCopier(numberOfGetters) {

  return function (newValues = {}) {
    const newState = Object.assign({}, this, newValues)

    Object.defineProperties(newState, {
      __previous__: {
        enumerable: false,
        writable: false,
        configurable: true,
        value: this
      },
      __computationsLeft__: {
        enumerable: false,
        writable: true,
        value: numberOfGetters
      }
    })

    newState.__proto__ = this.__proto__

    return newState
  }

}

function groupShapeElements(shape) {
  return Object
    .keys(shape)
    .reduce((acc, it) => {
      switch (typeof shape[ it ]) {
        case 'function':
          acc.getters[ it ] = shape[ it ]
          break

        default:
          acc.initialState[ it ] = shape[ it ]
          break
      }

      return acc
    }, { initialState: {}, getters: {} })
}

/**
 * Create a state container for a given shape
 *
 * @param shape
 */
export default function createState(shape) {
  const { initialState, getters } = groupShapeElements(shape)
  const numberOfGetters = Object.keys(getters).length

  const proto = Object
    .keys(getters)
    .reduce((acc, it) => {
      Object.defineProperty(acc, it, {
        enumerable: true,
        get: createMemoizedGetter(it, getters, getters[ it ])
      })

      return acc
    }, {})

  Object.defineProperty(proto, 'copy', {
    enumerable: false,
    writable: false,
    value: createCopier(numberOfGetters)
  })

  Object.defineProperty(initialState, '__computationsLeft__', {
    enumerable: false,
    writable: true,
    value: numberOfGetters
  })

  initialState.__proto__ = proto

  return initialState

}