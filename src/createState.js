import getDependencies  from './getDependencies';
import getKeyInjector   from './getKeyInjector';

export default function createState(shape, prevState) {

  const stateContainer = {};

  if (prevState)
    Object.keys(prevState)
      .filter(key => !shape.hasOwnProperty(key))
      .forEach(getKeyInjector(stateContainer, prevState, shape));
  else
    Object.keys(shape)
      .filter(key => typeof shape[ key ] === 'function')
      .forEach(key => {
        shape[ key ].updatedBy = getDependencies(shape, key);
      });

  Object.keys(shape).forEach(getKeyInjector(stateContainer, shape));

  Object.defineProperty(stateContainer, 'copy', {
    enumerable: false,
    writable  : false,
    value     : (newValues = {}) => createState(newValues, stateContainer)
  });

  return stateContainer;
}