import React from 'react'
import {
  DescriptionCart,
  Fill,
  SelectionFillSentence,
  SingleSelection,
  MutiSelection,
  Subjective,
  Read,
  Connection,
  ClozeContent,
  MutiSynthe,
  Judge,
  SingleListenFill,SingleListenJudge,
  SingleListenSingleSelection,MutiListen
} from '../analysis'
import {FillAnalysisTemplate,SingleSelectionAnalysisTemplate,
        MutiSelectionAnalysisTemplate,JudgeAnalysisTemplate,SubjectiveAnalysisTemplate} from '../templates'
export const mapTemplateAnalysis = (que,knowledges,usetime) => {
  switch (que.template) {
    case 1:
      return <SingleSelectionAnalysisTemplate que={que} knowledges={knowledges} uestime={usetime}/>
    case 2:
    case 3:
    case 4:
      return <MutiSelectionAnalysisTemplate que={que} knowledges={knowledges} uestime={usetime}/>
    case 5:
      return <FillAnalysisTemplate  que={que} knowledges={knowledges} uestime={usetime}/>
    case 6:
      return <JudgeAnalysisTemplate que={que} knowledges={knowledges} uestime={usetime}/>
    case 7:
      return <SubjectiveAnalysisTemplate que={que} knowledges={knowledges} uestime={usetime}/>
    default:
      return <div>{'没有这个模板'}</div>
  }
}
export const mapQueAnalysis = (que,totalNum,dispatch)=>{
  if(typeof que.desc !=='undefined'){
    return <DescriptionCart key={que.shortName+que.desc} desc={que.desc} shortName={que.shortName}/>
  }
  switch (que.template) {
    case 1:
      return <SingleSelection key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 2:
    case 3:
    case 4:
      return <MutiSelection  key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 5:
      return mapFillAnalysisTemplate(que,totalNum,dispatch)
    case 6:
      return <Judge key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 7:
      return <Subjective key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 8:
    case 9:
      return <MutiSynthe key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 12:
      return <ClozeContent key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 13:
      return <Connection key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 15:
      return <Subjective key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 16:
      return <Read key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 19:
      return <MutiListen key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 21:
      return <SelectionFillSentence key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 22://补全对话（其他）
      return <Subjective key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 23:
      return <SingleListenFill key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 24:
      return <SingleListenJudge key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 25:
      return <SingleListenSingleSelection key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    default:
      return <div></div>
  }
}
const mapFillAnalysisTemplate = (que,totalNum,dispatch)=>{
  switch (que.quesType) {
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 19:
    case 20:
    case 25:
    case 26:
    case 28:
    case 40:
    case 54:
    case 56:
    case 58:
    case 64:
    case 66:
    case 67:
    case 68:
    case 82:
    case 83:
    case 84:
      return <Fill key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    default:
      return <Subjective key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
  }
}
