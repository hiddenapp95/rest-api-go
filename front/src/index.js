import React from 'react';
import ReactDOM from 'react-dom';
import {Main} from './main';
import registerServiceWorker from './registerServiceWorker';
import store from "./store";
import "./assets/css/styles.css";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <Main />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
