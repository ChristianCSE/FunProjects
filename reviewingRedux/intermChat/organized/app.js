import { connect } from 'react-redux';

import { deleteMessage, openThread, addMessage } from './actions'
import { Tabs, Thread } from './components';


const App = () => {
  return (
    <div className='ui segment'>
      <ThreadTabs />
      <ThreadDisplay />
    </div>
  );
};

const mapStateToThreadProps = (state) => {
  return {
    thread: state.thread.find(
      (aThread) => aThread.id === state.activeThread
    )
  }
};

const mapDispatchToThreadProps = (dispatch) => {
  return {
    onMessageClick: (id) => {
      return dispatch(deleteMessage(id));
    }
  }
};

const ThreadTabs = connect(
  mapStateToThreadProps, 
  mapDispatchToThreadProps
)(Tabs);


const mapStateToTabsProps = (state) => {
  const tabs = state.thread.map((aThread) => {
    return {
      title: aThread.title, 
      active: aThread.id === state.activeThreadId, 
      id: aThread.id
    }
  });
  return tabs;
};

const mapDispatchToTabsProps = (dispatch) => {
  return {
    onClick: (id) => {
      return dispatch(openThread(id));
    }
  }
};

const mergeThreadProps = (stateProps, dispatchProps) => {
  return {
    ...stateProps, 
    ...dispatchProps, 
    onMessageSubmit: (text) => {
      return dispatchProps.dispatch(
        addMessage(text, stateProps.thread.id)
      );
    }
  };
}

const ThreadDisplay = connect(
  mapStateToTabsProps, 
  mapDispatchToTabsProps,
  mergeThreadProps
)(Thread);



//export default App
export App;