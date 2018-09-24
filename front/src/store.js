import {applyMiddleware, createStore} from 'redux';
import reducers from "./combinedReducers";
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import {WEB_APP_ONLINE} from "./main/actionTypes";
// import {loadState, saveState} from "./localStorage";

//const persistedState = loadState();

const store =
    createStore(
        reducers,
        applyMiddleware(thunk,logger)
    );

const listenToWindowEvent =
    (name, mapEventToAction) =>
        (dispatch) =>
            window.addEventListener(name, (e)=> dispatch(mapEventToAction(e)));

const navigatorOnLine = (e) => ({type: WEB_APP_ONLINE,payload: navigator.onLine});

store.dispatch(listenToWindowEvent('load', navigatorOnLine));
store.dispatch(listenToWindowEvent('offline', navigatorOnLine));
store.dispatch(listenToWindowEvent('online', navigatorOnLine));


// store.subscribe(() =>{
//     console.log(store);
//     saveState(store.getState())
// });

export default store;