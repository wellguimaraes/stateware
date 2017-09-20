# ![Actionware](assets/logo.png)
A fast, dependency-free state container with easy copy and automagically memoized getters, designed for immutability.

###### Extra power
Wanna reduce Redux boilerplate? Use it combined with **[Actionware](https://github.com/wellguimaraes/actionware)** lib.

## Install it
`npm i stateware --save`

`yarn add stateware`

## Use it
```js
import { createState } from 'stateware'

const initialState = createState({
  users: [],
  genderFilter: null,
  
  filteredUsers({ users, genderFilter }) {
    return users.filter(user => !genderFilter || user.gender === genderFilter);
  },
  
  totalPosts({ filteredUsers }) {
    return filteredUsers.reduce((sum, user) => sum + user.postsCount, 0);
  }
})

// Create a new state, updating 'users' value
const newState = initialState.copy({
  users: [
    { name: 'John Doe'     , gender: 'M', postsCount: 10 },
    { name: 'Jane Doe'     , gender: 'F', postsCount: 5 },
    { name: 'Alan Turing'  , gender: 'M', postsCount: 15 },
    { name: 'Ada Lovelace' , gender: 'F', postsCount: 16 }
  ]
})

// Access state values
newState.users
newState.genderFilter
newState.filteredUsers
newState.totalPosts

```

### Usage with Redux

Do this:
```js
switch (action.type) {
  case 'SET_GENDER_FILTER':
    return state.copy({
      genderFilter: action.payload
    })
}
```

Instead of:
```
switch (action.type) {
  case 'SET_GENDER_FILTER':
    const filter = action.payload
    
    return {
      ...state,
      genderFilter: filter,
      filteredUsers: state.users.filter(user => !filter || user.gender === filter)
    }
}
```

## License
[MIT](LICENSE) &copy; Wellington Guimaraes
