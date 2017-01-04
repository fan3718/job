import {createStore,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers/root'


export default function configureStore(preloadedStore){
  const store = createStore(
    rootReducer,
    preloadedStore,
    applyMiddleware(thunkMiddleware,createLogger())
  )
  return store;
}
