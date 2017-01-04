import React from 'react'
import {SubDragableCart} from '../widgets'
import {translateAnalysisContext,translateLongFill} from '../translateMiddware'
import {SingleSelectionAnalysisTemplate} from '../templates'
import R from 'ramda'

export const ClozeContent = (props) => {
  const {que,totalNum,handleSubIndexChange} = props
  const {queNoInPage,ques,title} = que;
  const aAnswer = R.compose(R.flatten,R.map(R.compose(e=>e.length===0?['']:e,R.prop('answer'))))(ques)
  const aJudge = R.compose(R.flatten,R.map(R.compose(e=>e.length===0?['']:e,R.prop('answer'))))(ques)
  return (
    <div className="selection-fill-sentence basecolor flex-columm">
      <div className="ques-panel">{translateAnalysisContext(translateLongFill(title),aAnswer,aJudge)}</div>
      <SubDragableCart ques={ques}
          notifySubQueIndexChange={handleSubIndexChange}
            queIndex={queNoInPage} quesNum={totalNum}>
          <SingleSelectionAnalysisTemplate que={que}/>
      </SubDragableCart>
    </div>
  )
}
