# Webpack 

Webpack is a build tool that puts all your assets: 
Js, images, fonts, CSS, etc. in a dependency graph. 
Webpack will benefit you if your app has many non-code static 
assets: CSS, images, fonts, etc. 
Browser doesn't support `require()` so we use a build tool to 
transform files using it into a bundled file. 
Webpack lets you use `require()` on local static assets === 
non-JS files. 
One of it's common uses is allowing one to use `import` or `require`
on non-JS e.g. CSS imports. `import 'style.css'`

## Overview 
Core Concepts: Entry, Output, Loaders, Plugins 

## Using 
It's better to install local rather than globally due to 
per-project updating 
```bash
yarn add webpack webpack-cli -D
```
then in your JSON file add: 
```js
{
  //... 
  "scripts": {
    "build": "webpack"
  }
}
```
and you can now finally run 
```bash 
yarn build 
```

## Defaulted Config 
**Entry Point**: `./src/index.js`
**Output**: `./dist/main.js`
Note that in this example the entry point is pointed towards 
`./index.js`
```js
module.exports = {
  entry: './index.js'
}
```


## Output 
Below makes it so rather than outputing the bundle in 
`./dist/main.js` it's put into `app.js`: 

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'app.js'
  }
}
```

We can allow non-JS imports `import 'style.css'` using a loader config: 
```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$\/, use: 'css-loader'}
    ]
  }
}
```


## Explaining Loaders
`Loaders`: 
Transformations applied on the source code of a module. 
They pre-process files as you import/load them -- similar to tasks. 
Can transform files from diff languages, inline images as data URLs, etc. 
They allow you to `import` CSS files directly from your JS modules. 

#### Using Loaders 
Three ways: `Configuration` (rec), `Inline`, `CLI`
**Configuration**: 
Allows you to specify serveral loaders within a webpack config. 
Concise & maintains clean code. 
Full overview of each respective layer.
```js
//Location: webpack.config.js
```