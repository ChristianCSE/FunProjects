

// const fetch = require('fetch');
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
let options = {
  method: 'POST',
  body:'query',
  headers:{
   'content-type': 'application/graphql'
   }
  };

fetch('https://graphqlhub.com/graphql', options)
.then((res) => {
 return res.json();
}).then((data) => {
 console.log(JSON.stringify(data,null,2));
});