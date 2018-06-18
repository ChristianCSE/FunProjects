
# General React 


## setState()
To prevent an auto re-render due to a state change, 
use `shouldComponentUpdate` which is triggered everytime
you change state or pass new props
```jsx
class myComponent extends React.Component {
  constructor(props){ 

  }
  
  //if our properties haven't change then there is no need
  //to re-render this component 
  shouldComponentUpdate(nextProps, nextState) {
   const reqPropChange = this.props.bar !== nextProps.bar; 
   const reqStateChange = this.state.foo !== nextState.foo; 
   return reqPropChange || reqStateChange; 
  }

  render(){
   return (<h1>Something</h1>);
  }

}
```

Before just using `shouldComponentUpdate()`, you should check 
if it is worth calling via [React's Performance Tools](https://reactjs.org/docs/perf.html) -- since 
this is an expensive call. 
It will tell you the # of wasted cycles. 


## setState updates
`setState()`, which is normally invoked as `this.setState({ val: 'something'})`
is also invoked as `this.setState({val: this.state.val + 1})`; 
`THIS IS BAD!`
`setState()` updaets the local state asynchronously; hence, request is neither immediate nor is it guaranteed it's applied instantly. 

BAD!
```jsx
this.setState({ val: this.state.val + 1})
```

BETTER!
```jsx
this.setState((prevState) => {
 return { val: prevState.val + 1};
})
```
`this.setState()` does have a callback that is triggered after the `setState()` is completed, but logic concerning `post rendering` is better left to 
`componentDidUpdate()`. 




## Components Lifecycle (React Lifecycle Methods: how & when)
**Mounting**: component is created/inserted into DOM. 
constructor->componentWillMount->render->componentDidMount
**Updating**: component re-rendered; caused by chnages of props/state.
=> `Props Change`: 
componentWillReceiveProps->shouldComponentUpdate->componentWillUpdate->render->
componentDidUpdate
=> `State Change`
shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate
**Unmounting**: removed from DOM. 


# componentWillReceiveProps
Use this to update the state in response to props changes!
Simply compare this.props with nextProps if there is a signifant change. 
```jsx
componentWillReceiveProps(nextProps) {
 //comparing these values is important, since 
 //componentWillReceiveProps can be called when props haven't changed!
 if(this.props.foo !== nextProps.foo) this.whenFooChanges();
 if(this.props.bar !=== nextProps.bar) this.whenBarChanges();
}
```
**EXTREMELY IMPORTANT**: `componentWillReceiveProps` is **invoked before **
a **mounted component receives new props**.
What does this mean? 
**React DOESN'T** call `componentWIllReceiveProps` with initial props during mounting!

