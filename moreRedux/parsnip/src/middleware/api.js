
import axios from 'axios';
export const CALL_API = 'CALL_API';

const API_BASE_URL = 'http://localhost:3001';


//NOTE: in order to keep this middleware generic, 
//we have to update the reducer! 

const makeCall = ({endpoint, method='GET', body}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  //NOTE: in order to treat diff request (get, post, put)

  const params = {
    method: method, 
    url, 
    data: body, 
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios(params)
  // .get(parms)
  //return the response from the promise handler 
  .then(resp => resp)
  .catch(err => err);
}

const apiMiddleware = store => next => action => {
  const callApi = action[CALL_API];
  //Guard clause checks if action contains relevant info, 
  //if not then send to next middleware
  if (typeof callApi === 'undefined') return next(action);
  
  const [
    requestedStartedType, 
    successType, 
    failureType
  ] = callApi.types; 
  //NOTE: next() will ultimately dispatch an action to the store 
  //treat this as passing an action object the same way you would with store.dispatch()
  //similar to dispatch(fetchTasksStarted()) 
  next({ type: requestedStartedType });

  //NOTE: pass the endpoint specified by current action 
  return makeCall(
    // callApi.endpoint
    //NOTE: providing more info to our call
    {
      method: callApi.method, 
      body: callApi.body, 
      endpoint: callApi.endpoint
    }
  )
  .then(
    //NOTE: Treating both success & failure approriately 
    (response) => next({
      type: successType, 
      payload: response.data
    })
    , 
    (error) => next({
      type: failureType, 
      error: error.message
    }),
  );
};

export default apiMiddleware;