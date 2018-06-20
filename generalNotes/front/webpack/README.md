# Webpack 

Webpack is a build tool that puts all your assets: 
Js, images, fonts, CSS, etc. in a dependency graph. 
Webpack will benefit you if your app has many non-code static 
assets: CSS, images, fonts, etc. 
Browser doesn't support `require()` so we use a build tool to 
transform files using it into a bundled file. 
Webpack lets you use `require()` on local static assets === 
non-JS files. 

## Overview 
Core Concepts: Entry, Output, Loaders, Plugins 

## Using 
It's better to install local rather than globally due to 
per-project updating 
```bash
yarn add webpack webpack-cli -D
```
