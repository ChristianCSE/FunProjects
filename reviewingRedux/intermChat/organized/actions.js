import { deleteMessage, openThread, addMessage } from './actions'

//action creators: just return an action = 
//action =  payloads of information that send data from your application to your store.
//actions = only source of info for the store, need to send them to the store via store.dispatch()
//these are unbounded action creators 
//actions can be async & have side-effects
export const deleteMessage = (id) => ({ type: 'DELETE_MESSAGE', id});

export const openThread = (id) => ({type: 'OPEN_THREAD', id});

export const addMessage = (text, threadId) => ({type: 'ADD_MESSAGE', text, threadId});


//bounded action creator
/*


const deleteMessage = (id) => ({ type: 'DELETE_MESSAGE', id});
export const boundDeleteMessage = (id) => dispatch(deleteMessage(id));

 */

//async actions 
/*

 */