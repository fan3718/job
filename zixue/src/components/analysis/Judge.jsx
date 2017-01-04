import React from 'react'
import {JudgeAnalysisTemplate} from '../templates'
import {AnswerCartMain} from '../widgets/'



export const Judge = (props) => {
  const {que,totalNum} = props
  const {queNoInPage} = que
  return (
    <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <JudgeAnalysisTemplate que={que}/>
    </AnswerCartMain>
  )
}
