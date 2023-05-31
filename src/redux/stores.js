import { legacy_createStore, compose, applyMiddleware } from 'redux'
import { typingReducer } from './typingReducer'
import thunk from 'redux-thunk'


let composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = legacy_createStore(typingReducer, composer(applyMiddleware(thunk)));