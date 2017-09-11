# StateWare
A dependency-free state container with easy copy and auto memoized getters

## Install it
`npm i stateware --save`

`yard add stateware`

## Use it
```js
import { createState } from 'stateware';

const initialState = createState({
  users: [],
  genderFilter: null,
  
  filteredUsers({ users, genderFilter }) {
    return users.filter(user => !genderFilter || user.gender === genderFilter);
  },
  
  totalPosts() {
    // you can use "this.propName" if you prefer
    return this.filteredUsers.reduce((sum, user) => sum + user.postsCount, 0);
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

Do this:
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
