//still following the method signature for redux middleware 
//remember to register this with our store! via applyMiddlware 

const analytics = store => next => action => {
  //NOTE: This is how middlware is normally implemented
  //Everything we do shouldn't need to go through all of middleware!
  if (!action || !action.meta || !action.meta.analytics) return next(action);

  const { event, data } = action.meta.analytics;
  
  //NOTE: No RETURN is invoked! on this invocation 
  fakeAnalyticsApi(event, data)
  .then( (resp) => {
    console.log('Recorded: ', event, data);
  }).catch( (err) => {
    console.error('An error occurred while sending analytics: ', err.toString());
  });
  return next(action);
};

const fakeAnalyticsApi = (eventName, data) => {
  return new Promise((resolve, reject) => {
    resolve('Success!');
  });
}

export default analytics;