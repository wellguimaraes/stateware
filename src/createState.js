import getKeyInjector from './getKeyInjector'

export default function createState(newValues, prevValues) {

  const newStateContainer = {}
  const proxyStateContainer = {}

  if (prevValues)
    Object.keys(prevValues)
      .filter(key => !newValues.hasOwnProperty(key))
      .forEach(getKeyInjector(newStateContainer, proxyStateContainer, prevValues, newValues))
  else
    Object.keys(newValues)
      .filter(key => typeof newValues[ key ] === 'function')
      .forEach(key => {
        newValues[ key ].updatedBy = {}
      })

  Object.keys(newValues)
    .forEach(getKeyInjector(newStateContainer, proxyStateContainer, newValues))

  Object.defineProperty(newStateContainer, 'copy', {
    enumerable: false,
    writable: false,
    value: (newValues = {}) => createState(newValues, newStateContainer)
  })

  return newStateContainer
}