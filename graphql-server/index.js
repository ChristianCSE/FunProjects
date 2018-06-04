require('babel-register');
require('./server');
//by requiring babel-register every subsequent call to require
//will go through Babel's transpiler 