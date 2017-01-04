import React from 'react'
import {translateFillAndContext} from '../translateMiddware'
import {UploadPanelWithBorder,UploadPanelPure,StandardAnalysis} from '../widgets'

export const SubjectiveTemplate = (props) => {
  const {que} = props;
  const {title,answer} = que;
  return (
    <div className="template">
      <div className="template-title">
          {translateFillAndContext(title)}
      </div>
      <div className="template-margin" >
        <UploadPanelWithBorder imgs={answer} className="template-margin" />
      </div>
    </div>
  )
}


export const SubjectiveAnalysisTemplate = (props)=>{
  const {que} = props;
  const {title,answer} = que;
  return (
    <div className="template">
      <div className="ques-panel template-title">
          {translateFillAndContext(title)}
      </div>
      <div className="template-margin" >
        <UploadPanelPure  imgs={answer}/>
        <hr/>
        <StandardAnalysis que={que}/>
      </div>
    </div>
  )
}
