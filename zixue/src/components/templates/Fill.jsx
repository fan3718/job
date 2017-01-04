require('./styles/Templates.less')
import React from 'react'
import {translateContext,translateAnalysisContext} from '../translateMiddware'
import {StandardAnalysis} from '../widgets'
export const FillTemplate = (props) => {
  const {que} = props;
  const {title , answer} = que;
  return (
    <div className="template flex-columm">
      <div className="template-title">
        {translateContext(title,answer)}
      </div>
    </div>
  )
}

export const FillAnalysisTemplate = (props) => {
  const {que} = props;
  const {title , userAnswer,correctResult} = que;
  return (
    <div className="template  flex-columm">
      <div className="template-title">
        {translateAnalysisContext(title,userAnswer,correctResult)}
      </div>
      <hr/>
      <div className="template-analysis">
        <StandardAnalysis {...props}/>
      </div>
    </div>
  )
}
