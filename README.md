# SmartState
Smart state container with easy copy and auto memoized getters

### Install it
`npm install smartstate --save`

### Use it
```js
import { createState } from 'smartstate';

const initialState = createState({
  users        : [],
  genderFilter : null,
  
  // Will be recalculated when 'users' or 'genderFilter' is updated
  filteredUsers(users, genderFilter) {
    return users.filter(user => !genderFilter || user.gender === genderFilter);
  },
  
  // Will be recalculated when 'filteredUsers' is updated
  totalPosts(filteredUsers) { 
    return filteredUsers.reduce((sum, user) => sum + user.postsCount, 0);
  }
});

// Create a new state, updating 'cities' value
const newState = initialState.copy({
  cities: [
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

#### Using with Redux

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

Do something like:
```js
switch (action.type) {
  case 'SET_GENDER_FILTER':
    return state.copy({
      genderFilter: action.payload
    });
}
```

