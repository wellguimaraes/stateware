# StateWare
Smart state container with easy copy/update and auto memoized getters.

## Install it
`npm install stateware --save`

## Use it
```js
import { createState } from 'stateware';

const initialState = createState({
  users        : [],
  genderFilter : null,
  
  // Define memoized getters

  // 'filteredUsers' will update when 'users' or 'genderFilter' is updated
  filteredUsers(users, genderFilter) {
    return users.filter(user => !genderFilter || user.gender === genderFilter);
  },
  
  // 'totalPosts' will update when 'filteredUsers' is updated
  totalPosts(filteredUsers) { 
    return filteredUsers.reduce((sum, user) => sum + user.postsCount, 0);
  }
});

// Create a new state, updating 'users' value
const newState = initialState.copy({
  users: [
    { name: 'John Doe'     , gender: 'M', postsCount: 10 },
    { name: 'Jane Doe'     , gender: 'F', postsCount: 5 },
    { name: 'Alan Turing'  , gender: 'M', postsCount: 15 },
    { name: 'Ada Lovelace' , gender: 'F', postsCount: 16 }
  ]
});

// Access state values
console.log(newState.users);
console.log(newState.genderFilter);
console.log(newState.filteredUsers);
console.log(newState.totalPosts);

```

### Usage with Redux

Do something like:
```js
switch (action.type) {
  case 'SET_GENDER_FILTER':
    return state.copy({
      genderFilter: action.payload
    });
}
```

Instead of:
```js
switch (action.type) {
  case 'SET_GENDER_FILTER':
    const filter = action.payload;
    return {
      ...state,
      genderFilter: filter,
      filteredUsers: ...
    }
}
```

### UglifyJS & mangling
If you're using UglifyJS with mangling, function parameters will get renamed and Stateware 
won't be able to identify a getter dependencies.
You can avoid this problem by using `createGetter` function this way:

```js
import { createState, createGetter } from 'stateware';

const initialState = createState({
  users        : [],
  genderFilter : null,
  
  filteredUsers: createGetter(['users', 'genderFilter'], (users, genderFilter) => {
    return users.filter(user => !genderFilter || user.gender === genderFilter);
  })
})
```

Yep, it's lil verbose, but we can minify things safely.