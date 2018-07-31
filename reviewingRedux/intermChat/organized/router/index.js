

// <Router />: will match a branch of its routes, and 
// render their config'd components
// <Route />: used to declare map routes to your app's 
// component hierarchy 

//Root.js
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Route path="/:filter?" component={App} />
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;

//index.js

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import todoApp from './reducers';
import Root from './Root';
const store = createStore(todoApp);
render(<Root store={store} />, document.getElementById('root'));

//FilterLink.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children }) => {
  return (
    <NavLink
      to={filter === 'SHOW_ALL' ? '/' : `/${filter}`}
      activeStyle={
        {
          textDecoration: 'none', 
          color: 'black'
        }
      }
    >
      {children}
    </NavLink>
  );
};

export default FilterLink;

//Footer.js


import React from 'react';
import FilterLink from './FilterLink';
import { VisibilityFilters } from './actions';

const Footer = () => {
  return (
    <p>
    Show: 
    {' '}
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      All 
    </FilterLink>
    {', '}
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      Active
    </FilterLink>
    {', '}
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      Completed 
    </FilterLink>
    </p>
  )
};

export default Footer;


//{containers}/VisibleTodoList.js
//this second argument belongs to mapStateToProps
//it is an object with every props passed to <VisibleTodoList />
//To filter out todos wrt URL you need to pass the URL params to 
//<VisibleTodoList />
const mapStateToProps = (state, ownProps) => {
  return {
    todos: getVisibleTodos(state.todos, ownProps.filter)
    //previously
    //getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

//mapStateToProps has an optional second arg ownProps
//that's an object with every props passed to <VisibleTodoList />

// <Route path="/:filter?" component={App}>

//params property is an object with every param 
//specified in the url with the match
//match.params will be equal to { filter: 'SHOW_COMPLETED' }


//if we are navigating to localhost:3000/SHOW_COMPLETED
//we can now read the URL from <App />

//App.js

const App = ({match: { params } }) => {
  return(
    <div>
      <AddTodo />
      <VisibleTodoList filter={params.filter || 'SHOW_ALL'} />
      <Footer />
    </div>
  );
};