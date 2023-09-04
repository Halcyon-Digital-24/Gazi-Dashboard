import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'react-quill/dist/quill.snow.css';
import 'react-date-range/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/theme/default.css';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
