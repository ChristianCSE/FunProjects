
//you don't have to consolidate this all to one thing 
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

//reducers that dispatched actions have to go through 

const activeThreadIdReducer = (state='1-fca2', action) => {
  return (action.type === 'OPEN_THREAD') ? action.id : state;
};

const threadReducer = (state=[ {}, {} ], action) => {
  switch(action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE':
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      const messages = messagesReducer(oldThread.messages, action);
      const newThread = { ...oldThread, messages};
      return [
        ...state.slice(0, threadIndex), 
        newThread, 
        ...state.slice(threadIndex + 1, state.length)
      ];
    default : {
      return state; 
    }
  }
};

//create your store after merging all you reducers 
//remember, that reducers are just responses to an action.
//reducers describe how the state changes 

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer, 
  threads: threadReducer
});

//creating a store that holds the entire state of the app 
//the only way to change the state is by dispatching ACTIONS
const store = createStore(reducer);


//mapStateToTabsProps = (access different parts of the entire global state)

const mapStateToTabsProps = (state) => {
  const tabs = state.thread.map(
    (aThread) => ({
      title: aThread.title, 
      active: aThread.id ==== state.activeThreadId, 
      id: aThread.id
    })
  );
  return tabs; 
};



//action creator
const openThread = (id) => {type: 'OPEN_THREAD', id};
//mapDispatchToTabsProps =  actions 
const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openThread(id))
    )
  }
)

//passing all our substates & actions to the Tabs Component 
const ThreadTabs = connect(
  mapStateToTabsProps, 
  mapDispatchToTabsProps
)(Tabs);

const mapStateToThreadProps = (state) => (
  {
    thread: state.thread.find(
      (aThread) => aThread.id === state.activeThreadId
    )
  }
);

//action creator => goes through our reducers 
const deleteMessage = (id) => ({ type: 'DELETE_MESSAGE', id});
//idk what to call this
const mapDispatchToThreadProps = (dispatch) => (
  {
    onMessageClick: (id) => (
      dispatch(deleteMessage(id))
    ) 
  }
);

//action creator
const addMessage = (text, id) => {type: 'ADD_MESSAGE', text, threadId};
//idk what to call this
const mergeThreadProps = (stateProps, dispatchProps) => (
  {
    ...stateProps, 
    ...dispatchProps, 
    onMessageSubmit: (text) => (
      dispatchProps.dispatch(addMessage(text, stateProps.thread.id))
    )
  }
)



const ThreadDisplay = connect(
  mapStateToThreadProps, 
  mapDispatchToThreadProps,
  mergeThreadProps
)(Tabs);



const WrappedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => (
  <div className='ui segment'>
  //NOTE WHAT THIS IS!!! 
    <ThreadTabs />
    <ThreadDisplay />
  </div>
);

const Thread = (props) => (
  <div className = 'ui center aligned basic segment'>
    <MessageList messages={props.thread.messages} onClick={props.onMessageClick} />
    <TextFieldSubmit onSubmit={props.onMessageSubmit} />
  </div>
);


//check if this works, it should imo 
// const MessageList = (props) => {
//   const commentsContainer = props.message.map((m, index) => (
//     <div className='comment' key={index} onClick={() => props.onClick(m.id)}>
//       <div className='text'> 
//         {m.text} 
//         <span className='metadata'> @{m.timestamp} </span>
//       </div>
//     </div>
//   ));
//   <div className='ui comments'>
//     {commentsContainer}
//   </div>
// };

const MessageList = (props) => (
  <div className='ui comments'>
  {
    props.message.map((m, index) => (
      //onClick from props and maps to onClick: (id) => ( dispatch(openThread(id)) )
      <div className='comment' key={index} onClick={() => props.onClick(m.id)}>
        <div className='text'> 
          {m.text} 
          <span className='metadata'> @{m.timestamp} </span>
        </div>
      </div>
    ));
  }
  </div>
);


class TextFieldSubmit extends React.Component {
  //we use extends React.Component due to wanting state & using 
  //this.setState locally 
  state = { 
    value: '' 
  };
  
  onChange = (e) => {
    this.setState({ value: e.target.value })
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({ value: '' });
  };

  render() {
    return (
      <div className='ui input'>
        <input onChange={this.onChange} value={this.state.value} type='text'>
        <button onClick={this.handleSubmit} className='ui primary button' type='submit'>
          Submit
        </button>
      </div>
    );
  }
};



