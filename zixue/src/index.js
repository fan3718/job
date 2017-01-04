import 'react-fastclick';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import url from 'url'
import R from 'ramda'
import App from './containers/App';
import ReportApp from './containers/ReportApp'
import {parseUrlSaveToGlobal} from './utils/'
import {fetchCartIfNeed} from './actions/FetchCartAction'
import {addAnswerPush,changeVisitedState,toogleShowCart,addSubAnswerPush} from 'actions/Syncactions'
import injectTapEventPlugin from 'react-tap-event-plugin'
const  hasVisited = window.localStorage.getItem('hasVisited')||false
/**
 * 注入tap事件插件
 */
injectTapEventPlugin({
  shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
    return true;
  }
});
let store = configureStore();
const query = url.parse(window.location.href).query;
if(query){
  parseUrlSaveToGlobal(query);
}
new Promise(function(resolve){
  store.dispatch(fetchCartIfNeed(true));
  resolve();
})
window.getImgList = function(str){
  const answers =  R.split('||')(str);
  if(answers[0]==-1){
    store.dispatch(addAnswerPush(store.getState().currentIndex,answers[1]))
  }else{
    store.dispatch(addSubAnswerPush(store.getState().currentIndex,answers[0],answers[1]))
  }
}
window.pause = function(){
  window.isShowCart = store.getState().isShowCart;
  if(!store.getState().isShowCart){
    store.dispatch(toogleShowCart())
  }
}
window.restart = function(){
  if(!window.isShowCart){
    store.dispatch(toogleShowCart())
  }
}
if(!hasVisited){
  store.dispatch(changeVisitedState(0))
}
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
