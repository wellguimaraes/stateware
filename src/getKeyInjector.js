const fnPrefix = '@@'
const fnPrefixLength = fnPrefix.length

function memoize(fn) {
  let value
  let executed = false

  return function () {
    if (!executed) {
      executed = true
      value = fn.apply(this, arguments)
    }

    return value
  }
}

export function getProxyContainer(fn, stateContainer) {
  return Object.keys(stateContainer).reduce((acc, key) => {

    const cleanKey = typeof stateContainer[ key ] === 'function'
      ? key.substr(fnPrefixLength)
      : key

    Object.defineProperty(acc, cleanKey, {
      enumerable: false,
      get: memoize(() => {
        fn.updatedBy[ cleanKey ] = true
        return stateContainer[ cleanKey ]
      })
    })

    return acc

  }, {})
}

export default function getKeyInjector(newStateContainer, source, newValues) {
  return key => {
    if (typeof source[ key ] !== 'function') {

      newStateContainer[ key ] = source[ key ]

    } else {

      const getterKey = key.startsWith(fnPrefix) ? key.substr(fnPrefixLength) : key
      const functionKey = fnPrefix + getterKey

      const getter = () => {
        const updatedBy = Object.keys(source[ key ].updatedBy)
        const shouldComputeValue =
          !newValues || (
            updatedBy.length === 0 ||
            updatedBy.some(key => newStateContainer[ key ] !== source[ key ])
          )

        if (shouldComputeValue) {
          const proxyContainer = getProxyContainer(source[ key ], newStateContainer)
          return source[ key ].call(proxyContainer, proxyContainer)
        } else {
          return source[ getterKey ]
        }
      }

      Object.defineProperty(newStateContainer, functionKey, {
        enumerable: true,
        writable: false,
        value: source[ key ]
      })

      Object.defineProperty(newStateContainer, getterKey, {
        enumerable: false,
        get: memoize(getter)
      })
    }
  }
}