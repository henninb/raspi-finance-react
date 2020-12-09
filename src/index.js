import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    //TODO: look at turning back on
    // <React.StrictMode>
    <App/>
    // </React.StrictMode>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
