import memoize from 'lodash.memoize';

export default function getKeyInjector(stateContainer, reference, newValues) {
  return key => {
    if (typeof reference[ key ] !== 'function') {

      stateContainer[ key ] = reference[ key ];

    } else {

      const getterKey   = key.replace(/@@__fn_/g, '');
      const functionKey = '@@__fn_' + getterKey;

      const shouldReuseCache = (
        newValues &&
        reference[ functionKey ].updatedBy &&
        reference[ functionKey ].updatedBy.every(key => !newValues.hasOwnProperty(key))
      );

      const getter = memoize(() => {
          if (shouldReuseCache)
            return reference[ getterKey ];
          else {
            const params = reference[ key ].paramNames.map(param => stateContainer[ param ]);
            return reference[ key ].apply(stateContainer, params);
          }
        }
      );

      Object.defineProperty(stateContainer, functionKey, {
        enumerable: true,
        writable  : false,
        value     : reference[ key ]
      });

      Object.defineProperty(stateContainer, getterKey, {
        enumerable: false,
        get       : getter
      });

    }
  }
}