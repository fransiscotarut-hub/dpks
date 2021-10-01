import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd'
import moment from 'moment';
import 'moment/locale/id'
import idID from 'antd/lib/locale/id_ID';
import { HashRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalModelsProvider } from './contexts/ModelsContext';
import { UserProvider } from './contexts/UserContext';

moment.locale('id')

ReactDOM.render(
  <React.StrictMode>
    <GlobalModelsProvider>
      <UserProvider>
        <HashRouter>
          <ConfigProvider locale={idID}>
            <App />
          </ConfigProvider>
        </HashRouter>
      </UserProvider>
    </GlobalModelsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
