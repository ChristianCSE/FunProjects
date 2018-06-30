
.apply()
```js
function myFunc(param1, param2) { alert(this); }

let first = 'foo';
let second = 'bar';
myFunc.call('test', first, second);
myFunc.apply('test', [first, second]);
```

