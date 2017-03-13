import flattenDeep from 'lodash.flattendeep';
import getParamNames from './getParamNames';

export default function getDependencies(shape, key) {
  if (typeof shape[ key ] === 'function') {
    if (!shape[key].paramNames)
      shape[ key ].paramNames = getParamNames(shape[ key ]);

    return flattenDeep(shape[ key ].paramNames.map(it => getDependencies(shape, it)));
  } else
    return key;
}