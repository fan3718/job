import fetch from 'isomorphic-fetch'
import * as types from '../constants/AsyncTypes'
import _ from 'lodash'
import querystring from 'querystring'
import {addIndexForPageGen} from '../utils/'
const addIndex = addIndexForPageGen();
function requestCart(subject,examId,exerId,uid,key,sign,report){
  return {
    type:types.REQUEST_CART,
    subject,examId,exerId,uid,key,sign,report
  }
}
function receiveCart(json){
  const page = addIndex(_.assign({},json,{isFetching:false,isValid:true}))
  return {
    type:types.RECEIVE_CART,
    page
  }
}

export function fetchCart(report){
  const subject = window.subject
  const examId = window.examId
  const exerId = window.exerId
  const uid = window.uid
  const key = window.key
  const sign = window.sign
  const params = {
    subject,examId,exerId,uid,key,sign,report
  }
  const query = querystring.stringify(params)
  return dispatch => {
    dispatch(requestCart(subject,examId,exerId,uid,key,sign))
    return fetch('/selfstudy/exam/structure?'+query,{
      method:'get',
      credentials: 'same-origin'
    }).then(response=>response.json()).then(json=>dispatch(receiveCart(json)))
  }
}

function shouldFetchCart(state){
  const page = state.page;
  if(!page){
    return true
  }
  if(page.isFetching){
    return false
  }
  return !page.isValid;
}

export function fetchCartIfNeed(report){
  return (dispatch,getState) =>{
    if(shouldFetchCart(getState())){
      return dispatch(fetchCart(report))
    }
  }
}
