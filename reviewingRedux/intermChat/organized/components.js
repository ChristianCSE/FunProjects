import React from 'react';

const Tabs = (props) => {
  const tabOptions = props.tabs.map((tab, index) => {
    return(
      <div 
        key={index} 
        className={tab.active ? 'active item' : 'item'} 
        onClick={() => props.onClick(tab.id)}
      >
        {tab.title}
      </div>
    );
  });
  
  return(
    <div className='ui top attached tabular menu'>
      {tabOptions}
    </div>
  );
};

const Thread = (props) => {
  return(
    <div className='ui center aligned basic segment'>
      <MessageList 
        messages={props.thread.message} 
        onClick={props.onMessageClick}
      />
      <TextFieldSubmit 
        onSubmit={props.onMessageSubmit}
      />
    </div>
  );
};

const MessageList = (props) => {
  const textMessages = props.message.map((m, index) => {
    return(
      <div 
        className='comment' 
        key={inedx}
        onClick={() => props.onClick(m.id)}
      >
        {m.text}
      <span className='metadata'> @{m.timestamp} </span>
      </div>
    );
  });

  return (
    <div className='ui comments'>
      {textMessages}
    </div>
  );
};

class TextFieldSubmit extends React.Component {
  //since we are tracking state locally within this 
  //component we need to extend to React.Component 
  state = {
    value: ''
  };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    this.setState({ value: ''});
  };

  render() {
    return (
      <div className='ui input'>
        <input 
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        >
        <button 
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
          >
          Submit
          </button>
      </div>
    );
  }

}

export {
  Tabs,
  Thread
}