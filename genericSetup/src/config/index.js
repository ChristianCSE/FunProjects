"use strict";
import { available_env } from './constants'; //needs to be "<k,v>"

const set_env = (env) => {

  if(typeof(env)!=="string" || available_env[env]===undefined){
    console.error('ERROR in config/index.js invalid env:', env);
    process.exit(1);
  }

  const config = `../env/${env}`;

  console.log('config env: ', config);

  return config; 
};

module.exports = {
  set_env, 
};