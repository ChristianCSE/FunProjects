
import { Provider } from 'react-redux';
import App from './app';

const WrappedApp = () => {
  <Provider store = {store} >
    <App />
  </Provider>
};

