import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalModelsProvider } from './contexts/ModelsContext';
import { UserProvider } from './contexts/UserContext';

ReactDOM.render(
  <React.Fragment>
    <GlobalModelsProvider>
      <UserProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </UserProvider>
    </GlobalModelsProvider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
