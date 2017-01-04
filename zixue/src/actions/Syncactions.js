import * as types from '../constants/SyncTypes'

export const toogleShowCart = ()=>{
  return {type:types.TOGGLE_SHOW_CART}
}
export const toogleShowAlert = ()=>{
  return {type:types.TOGGLE_SHOW_ALERT}
}
export const setCurrentIndex = (index)=>{
  return {type:types.SET_CURRENT_INDEX,index}
}
export const setSlickOrientation = (isGoNext)=>{
  return {type:types.SET_SLICK_ORIENTATION,isGoNext}
}

export const canSubmit = () =>{
  return {type:types.CAN_SUBMIT}
}

export const addDoneCount = ()=>{
  return {type:types.ADD_DONE_COUNT}
}

export const addAnswer = (index,answer,answerPos) => {
  return {type:types.ADD_ANSWER,index,answer,answerPos}
}

export const addAnswerRemoveRepeat  = (index,answer,answerPos)=>{
  return {type:types.ADD_ANSWER_REMOVE_REPEAT,index,answer,answerPos}
}

export const addSubAnswer = (index,subIndex,answer,answerPos) => {
  return {type:types.ADD_SUB_ANSWER,index,subIndex,answer,answerPos}
}

export const addSingleAnswer = (index,answer) => {
  return {type:types.ADD_SINGLE_ANSWER,index,answer}
}

export const addSubSingleAnswer = (index,subIndex,answer) => {
  return {type:types.ADD_SUB_SINGLE_ANSWER,index,subIndex,answer}
}

export const addTime  = (index,time) => {
  return {type:types.ADD_TIME,index,time}
}
export const toggleAddAnswer = (index,answer) => {
  return {type:types.TOGGLE_ADD_ANSWER,index,answer}
}

export const toogleAddSubAnswer = (index,subIndex,answer) => {
  return {type:types.TOGGLE_ADD_SUB_ANSWER,index,answer}
}


export const deleteAnswer = (index,answerPos) => {
  return {type:types.DELETE_ANSWER,index,answerPos}
}

export const deleteSubAnswer = (index,subIndex,answerPos) => {
  return {type:types.DELETE_SUB_ANSWER,index,subIndex,answerPos}
}


export const addAnswerPush = (index,answer) => {
  return {type:types.ADD_ANSWER_PUSH,index,answer}
}

export const addSubAnswerPush = (index,subIndex,answer) => {
  return {type:types.ADD_SUB_ANSWER_PUSH,index,subIndex,answer}
}


export const deleteAnswerSplice = (index,answerPos) => {
  return {type:types.DELETE_ANSWER_SPLICE,index,answerPos}
}

export const deleteSubAnswerSplice = (index,subIndex,answerPos) => {
  return {type:types.DELETE_SUB_ANSWER_SPLICE,index,subIndex,answerPos}
}
export const changeVisitedState = (hasVisited)=>{
  return {type:types.HAS_VISITED,hasVisited}
}
