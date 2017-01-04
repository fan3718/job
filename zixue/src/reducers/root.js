import {combineReducers} from 'redux'
import _ from 'lodash'
import * as sType from '../constants/SyncTypes'
import * as aType from '../constants/AsyncTypes'
import {splitIndexAndParserNumber} from '../utils'
const isShowCart = (state=true,action)=>{
  switch(action.type){
    case sType.TOGGLE_SHOW_CART:
      return !state
    default:
      return state
  }
}
const isShowAlert = (state=true,action)=>{
  switch(action.type){
    case sType.TOGGLE_SHOW_ALERT:
      return !state
    default:
      return state
  }
}
const  canSubmit = (state=false,action)=>{
  switch (action.type) {
    case sType.CAN_SUBMIT:
      return true;
    default:
      return state;

  }
}

const isGoNext = (state=true,action)=>{
  switch(action.type){
    case sType.SET_SLICK_ORIENTATION:
      return action.isGoNext;
    default:
      return state;
  }
}
/**
 *state=0//未访问过
 *state=1//访问过第一个引导图
 *state=2//访问过第二个引导图
 *state=3//全部访问过
 *
 */
const hasVisited = (state=3,action)=>{
  switch (action.type) {
    case sType.HAS_VISITED:
      return action.hasVisited
    default:
      return state

  }
}
const currentIndex = (state='0',action) => {
  switch (action.type) {
    case sType.SET_CURRENT_INDEX:
      return action.index
    default:
      return state
  }
}
const page = (state={isFetching:false,isValid:false},action) => {
  switch(action.type) {
    case aType.REQUEST_CART:
      return _.assign({},state,{isFetching:true,isValid:false});
    case aType.RECEIVE_CART:
      return _.assign({},action.page,{isFetching:false,isValid:true});
    case sType.ADD_DONE_COUNT:
      return _.assign({},state,{doneCount:1})
    case aType.REQUEST_QUE:
    case aType.RECEIVE_QUE:
    case sType.ADD_ANSWER:
    case sType.ADD_SINGLE_ANSWER:
    case sType.DELETE_ANSWER:
    case sType.TOGGLE_ADD_ANSWER:
    case sType.ADD_SUB_ANSWER:
    case sType.ADD_SUB_SINGLE_ANSWER:
    case sType.ADD_ANSWER_REMOVE_REPEAT:
    case sType.DELETE_SUB_ANSWER:
    case sType.TOGGLE_ADD_SUB_ANSWER:
    case sType.ADD_ANSWER_PUSH:
    case sType.ADD_SUB_ANSWER_PUSH:
    case sType.DELETE_ANSWER_SPLICE:
    case sType.DELETE_SUB_ANSWER_SPLICE:
    case sType.ADD_TIME:
      const newState = _.assign({},state);
      const [a,b,c,d] = splitIndexAndParserNumber(action.index)
      let   que ;
      if(typeof d !=='undefined'){
        que = newState.paperStructure[a].quesGroups[b].ques[c].ques[d]
        newState.paperStructure[a].quesGroups[b].ques[c].ques[d] = dealQue(que,action)
      }else {
        que = newState.paperStructure[a].quesGroups[b].ques[c];
        newState.paperStructure[a].quesGroups[b].ques[c] = dealQue(que,action)
      }
      return newState;
    default:
      return state
  }
}
const dealQue = (state={isFetching:false,isValid:false},action) => {
  switch (action.type) {
    case aType.REQUEST_QUE:
      return _.assign({},state,{isFetching:true,isValid:false})
    case aType.RECEIVE_QUE:
      if(typeof action.que.ques !== 'undefined'&&action.que.ques.length>0){
        action.que.ques.forEach(e=>e.answer=e.userAnswer||[])
      }else{
        action.que.answer = action.que.userAnswer||[]
      }
      return _.assign({},state,action.que,{isFetching:false,isValid:true})
    case sType.ADD_TIME:
      return _.assign({},state,{usetime:action.time})
    case sType.ADD_ANSWER:
    case sType.ADD_SINGLE_ANSWER:
    case sType.ADD_ANSWER_PUSH:
    case sType.ADD_ANSWER_REMOVE_REPEAT:
    case sType.DELETE_ANSWER_SPLICE:
    case sType.DELETE_ANSWER:
    case sType.TOGGLE_ADD_ANSWER:
      const  newState = _.assign({},state);
      newState.answer = dealAnswer(newState.answer,action)
      return newState;
    case sType.ADD_SUB_ANSWER:
    case sType.ADD_SUB_SINGLE_ANSWER:
    case sType.ADD_SUB_ANSWER_PUSH:
    case sType.DELETE_SUB_ANSWER_SPLICE:
    case sType.DELETE_SUB_ANSWER:
    case sType.TOGGLE_ADD_SUB_ANSWER:
      const {subIndex} = action;
      state.ques[subIndex].answer = dealAnswer(state.ques[subIndex].answer,action)
      return state;
    default:
      return state;
  }
}
const dealAnswer = (state = [],action) => {
  const newState = [...state];
  const {answer,answerPos} = action
  switch (action.type) {
    case sType.ADD_ANSWER:
    case sType.ADD_SUB_ANSWER:
       newState[answerPos] = answer;
       return newState
    case sType.ADD_SINGLE_ANSWER:
    case sType.ADD_SUB_SINGLE_ANSWER:
       return [answer]
    case sType.DELETE_ANSWER:
    case sType.DELETE_SUB_ANSWER:
       newState[answerPos] = null
       return newState;
    case sType.TOGGLE_ADD_ANSWER:
    case sType.TOGGLE_ADD_SUB_ANSWER:
       if(newState.includes(answer)){
         const index = newState.findIndex(n=>n===answer)
         newState.splice(index,1);
       }else{
         newState.push(answer);
       }
       return newState;
    case sType.ADD_ANSWER_REMOVE_REPEAT:
      if(newState.includes(answer)){
        const index = newState.findIndex(n=>n===answer)
        newState[index] = '';
      }
      newState[answerPos] = answer;
      return newState
    case sType.ADD_ANSWER_PUSH:
    case sType.ADD_SUB_ANSWER_PUSH:
      newState.push(answer);
      return newState;
    case sType.DELETE_ANSWER_SPLICE:
    case sType.DELETE_SUB_ANSWER_SPLICE:
      newState.splice(answerPos,1)
      return newState;
    default:
      return state;
  }
}
const  rootReducer = combineReducers({
  isShowCart,
  isShowAlert,
  currentIndex,
  canSubmit,
  isGoNext,
  hasVisited,
  page
})
export default rootReducer;
