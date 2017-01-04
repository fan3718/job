import fetch from 'isomorphic-fetch'
import * as types from '../constants/AsyncTypes'
import R from 'ramda'
import querystring from 'querystring'
function requestQue(subject,examId,exerId,quesId,uid,key,sign,detail,report,index){
  return {
    type:types.REQUEST_QUE,
    subject,examId,exerId,uid,key,sign,quesId,detail,report,index
  }
}
function receiveQue(que,index){
  return {
    type:types.RECEIVE_QUE,
    que,
    index
  }
}

export function fetchQue(quesId,detail,report,index){
  const subject = window.subject
  const examId = window.examId
  const exerId = window.exerId
  const uid = window.uid
  const key = window.key
  const sign = window.sign
  const params = {
    subject,examId,uid,key,sign,quesId,report,detail
  }
  const query = querystring.stringify(params)
  return dispatch => {
    dispatch(requestQue(subject,examId,exerId,quesId,uid,key,sign,detail,report,index))
    return fetch('/selfstudy/exam/ques/detail?'+query,{
      method:'get',
      credentials: 'same-origin'
    }).then(response=>response.json()).then(json=>dispatch(receiveQue(json,index)))
  }
}

function shouldFetchQue(state,i){
  const index = R.compose(R.map(e=>e*1),R.split('-'))(i);
  if(index.length<3){
    return false;
  }
  const queOrStructure = state.page.paperStructure[index[0]].quesGroups[index[1]].ques[index[2]];
  let que
  if(index.length===4){
    que = queOrStructure.ques[index[3]];
  }else {
    que = queOrStructure;
  }
  if(!que){
    return true
  }
  if(que.isFetching){
    return false
  }
  return !que.isValid;
}

export function fetchQueIfNeed(quesId,detail,report,index){
  return (dispatch,getState) =>{
    if(shouldFetchQue(getState(),index)){
      return dispatch(fetchQue(quesId,detail,report,index))
    }
  }
}
