import React from 'react'
import {SingleSelectionAnalysisTemplate,MutiSelectionAnalysisTemplate} from '../templates'
import {AnswerCartMain} from '../widgets/'



export const SingleSelection = (props) => {
  const {que,totalNum} = props
  const {queNoInPage} = que
  return (
    <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <SingleSelectionAnalysisTemplate que={que}/>
    </AnswerCartMain>
  )
}

export const MutiSelection = (props) => {
  const {que,totalNum} = props
  const {queNoInPage} = que
  return (
    <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
      <MutiSelectionAnalysisTemplate que={que}/>
    </AnswerCartMain>
  )
}
