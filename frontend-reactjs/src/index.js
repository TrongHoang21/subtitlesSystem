import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import RouteConfig from './routes/RouteConfig';
import { Provider } from 'react-redux';
import { store } from './reduxComponents/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouteConfig/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
