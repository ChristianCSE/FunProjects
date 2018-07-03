


## Middleware

```js
import * as express from 'express';
const app = express();
//NOTE: we are invoking use(callback)
app.use((req, res, next)=>{
  console.log('TIME: ', Date.now());
  next(); //
})
```
The above is executed on every request. 
(this is due to the lack of a specified route)

```js 
app.use('/user/:id', (req, res, next)=> {
  console.log('Request: ', req.method);
  next(); 
})
```
Note, that we specified a route this time!

```js 
app.use('/user/:id', (req, res, next) => {
  console.log('Req URL: ', req.originalURL);
  next();
}, (req, res, next) => {
  console.log('Req Type: ', req.method);
})
```


Middleware stack 
```js 
app.get('/user/:id', (req, res, next)=>{
  if(req.params.id === '0') next('route');
  next();
}, (req, res, next) => {
  res.send('Info');
})

app.get('/user/:id', (req, res, next) => {
  res.render('special');
})
```