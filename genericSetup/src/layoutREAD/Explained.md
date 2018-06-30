# Aside 
**Arrow functions =>** DO NOT have their own `this` or `arguments` binding. 
**NOTE**: This means that it is not possible to set an arrow function's 
`this` with `.bind` or `.call`,

**Callable vs. Constructable**: 
**Callable**: Can be called without `new`.
**Constructable**: Can be called with `new`, e.g. `new User()`

**Replaceable**: 
Functions that don't use `this` or `arguments`
FUnctions tat are used with `.bind(this)`
**Not Replaceable**: 
Constructor functions, fxns/mthds added to a prototype (they use `this`),
variadic fxns (they use `arguments`), object methods 
# Layout 


//route.js
```js
import * as userControllers from 'controllers/users/';

//NOTE: Callback 
router.get('/users/:username', userControllers.getUser);
```

//controllers/users.js
```js
import User from '../models/User';
const getUser = (req, res, next) => {
 const username = req.params.username; 
 if (username === '') {
   return res.status(500).json({ error: 'Username can not be blank'});
 }
 try {
  const user = await User.find({ username }).exec(); //db request
  return res.status(200).json(user);
 } catch(error) {
  return res.status(500).json(error);
 }
}
```

socket.io part
```js
import User from '../models/User';
socket.on('RequestUser', (data, ack) => {
 const username = data.username; 
 if (username === '') ack ({ error: 'Username can not be blank'});
 try {
  const user = User.find({ username }).exec(); 
  return ack(user);
 } catch (error) {
  return ack(error);
 }
})
```

### Things to NOTE
`if (username ==== ' ')` & `User.find({ username })` 
are used twice in seperate files. 
Also, note controller's constant use of `.json({error: blah})`
You may eventually want to make more useful responses 



### Direction 
Model -> Service -> Controller -> Router

So essentially the router calls the controller. 
The controller then calls the appropriate service. 
The service makes the actual db request. 
Models is the db model (table) along with validation


## Models
//models/User/validate.js (use proper validators wrt db)
```js
export function validateUsername(username) return true;
```
//models/User/index.js
```js
import { validateUsername } from './validate';
const userSchema = new Schema({
 username: {
  type: String, 
  unique: true, 
  validate: [{ valdiate: validateUsername, msg: 'Invalid username'}]
 } 
}, { timestamp: true });
const User = mongoose.model('User', userSchema);
export defualt User; 
```
NOTE: We should be diong most model validation here rather than in the controller.

## Service
Service acts as the processor. It processes acceptable parameters and return 
a value. 
//services/user.js
```js
function getUser(username) return User.find({ username }).exec();
```

TODO: Understand what this means
`Making sure that your sync service never includes I/O, since it will be blocking the whole Node.js thread`

## Controller 
In order to avoid duplicate controllers, we only have a controller for each action. 
// controllers/user.js
```js
export function getUser(username){
}
```
NOTE: no req,res,next since we don't really need all those things
// controller/user.js
```js
import { getUser as getUserService } from '../services/user.js';
/**
 * Get a user by username
 * @param  {string} username [user's username]
 * @return {Promise}          [exception or value]
 */
function getUser(username) {
 //NOTE: it seems odd to throw an error without some catch ... ?
 if (username === '') throw new Error('Username can not be blank');
 return getUserService(username);
}
```

## A dilema
=> Controllers forced to return `Promise`
=> Services forced to return `Promise`

Since controllers are the ones that are usually chain `Promises`, it's more 
convenient to have Controllers return `Promises`

### Important 
ES6 `Promise` can handle non-promises during their lifespan and still keep 
returning a `Promise`
We can also make a `Promise` ourselves, in case a service we call doesn't use 
a Promise
```js
return Promise.resolve() //init Promise for first time
 .then(()=>isValid('name'))
```
hence our example, in order to be consistent would require the inclusion of 
`return Promise.resolve()` even though in this case we don't actually need it since `getUserService()` already returns a `Promise`, but since we want to guarentee this in `controller` we keep the `guarenteed` syntax consistent. 

Lastly, one can also make use of `async/awiat`
```js
//NOTE: async is in front of our function!
async function myController() {
 const user = await findUserByUsername();
 const chat = await getChat(user);
 const something = doSomething(chat);
 return something; 
}
```

## Router
Remember that our Controller ALWAYS either returns a `Promise` or throws an `Error`. 
**Router**:
->Controls petitions & returns data to clients. (null,unedf,error,etc)
->Will be the ONLY one that have mult. defns, which depend on our `interceptors`.
->Out interceptors, in this case, are `API=Express` & `Socket=Socket.io`

This is a naive version 
```js 
router.get('users/:username', (req, res, next) => {
 try { 
  const result = await getUser(req.params.username);
  return res.status(200).json(result);
 } catch(error) {
  return res.status(500).json(error);
 }
})
```

Instead, we can create a Fake Router Client that takes a `Promise` & `n` number of parameters and does its `routing` and `return` tasks. 
```js
const controllerHandler = (promise, params) => async (req, res, next) => {
  //if params exist invoke the method and 
  //send the respective req, res, next arguments 
  //params is a function that is passed to this controller handler 
  //that will usually be a method that extracts the relevant parameters 
  const boundParams = params ? params(req, res, next) : []; 
  try {
    //promise is usually some controller method (goes to db)
    //we send all relevant params to it
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK'});
  } catch (error) {
    return res.status(500).json(error)
  }
};
const c = controllerHandler; //rename for name shortening
```
Due to the above, our route would be 
```js
//we return our params in an array to allow for a spread operator 
router.get('users/:username', 
  c(getUser, (req, res, next) => [req.params.username] )
)
```

If you want to avoid the awkward syntax from `return Promise.resolve().then()`
you can setup a global variable and do something along the lines of: 
```js
const chain = Promise.resolve();
chain 
  .then(()=>)
  .then(()=>)
```


### Express error handler
Opt-out for something like `debug` or `winston` rather than `console.error`
Which would allow controllerHandler to implement this: 
```js
 catch(error) {
  return res.status(500) && next(error);
 }
```
#### Error as APIError
To track your own controller errors you can make it find your needs 
```js
export class APIError{
  constructor(message, status=500) {
    this.message = message; 
    this.status = status;
  }
}
```





# Result 

router -(calls w/ param)-> controller -(calls)-> service (makes db request)

router.js
```js
import { getUser } from '../controlers/user.js';

const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try{
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK'} );
  } catch(error) {
    return res.status(500) && next(error);
  }
};

const extractUsername = (req, res, next) => [req.params.username];
//can rename controllerHandler
//getUser is guarenteed to be a promise, we said controller will always return 
//a promise
router.get('/users/:username', controllerHandler(getUser, extractUsername) );
```

controllers/user.js
```js
import { serviceFunction } from 'service/user.js';
import { getUserService, getUserChatService } from 'service/user.js';

//NOTE: entire function prefaced with async
export async function getUser(username) {
  //const user = await findUserByUsername(username); //db request
  //const chat = await getChat(user); //db request
  //const something = doSomething(chat);
  //return something; 
  //I am unsure why in the example he forgoes the getXService naming
  const user = await getUserService(username);
  const chat = await getUserChatService(user);
  return { user, chat };
}
```

services/user.js
```js
import User from '../models/User';
export function getUser(username) => User.find({}).exec();
```

models/User/index.js
```js
import { validateUsername } from './validate';

const userSchema = new Schema({
  username: {
    type: String, 
    unique: true, 
    validate: [{validator: validateUsername, msg: 'Invalid username'}]
  }, 
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export defualt User; 
```

models/User/validate.js
```js
export function validateUsername(username) => true;
```






