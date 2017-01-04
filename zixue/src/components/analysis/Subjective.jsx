import React from 'react'
import {AnswerCartMain } from '../widgets'
import {SubjectiveAnalysisTemplate} from '../templates'

export const Subjective = (props)=>{
  const {que,totalNum} = props
  const {queNoInPage} = que;
  return(
    <AnswerCartMain className="flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <SubjectiveAnalysisTemplate que={que}/>
    </AnswerCartMain>
  )
}
