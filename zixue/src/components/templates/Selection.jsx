require('./styles/Templates.less')
import React ,{Component}from 'react'
import {SingleSelectionPanel, MutiSelectionPanel,JudgePanel,
        SingleSelectionAnalysisPanel,MutiSelectionAnalysisPanel,JudgeAnalysisPanel}
        from '../widgets/'
import {translateFillAndContext} from '../translateMiddware'
import {StandardAnalysis} from '../widgets'
const SelectionFactory = (Comp) => class extends Component{
  render(){
    const {que} = this.props;
    const {title , answer , selection} = que;
    return (
      <div className="template flex-columm">
        <div className="template-title">
          {translateFillAndContext(title)}
        </div>
        <div className="template-margin">
          <Comp className="template-margin" answer={answer} selection={selection}/>
        </div>
      </div>
    )
  }
}
export const SingleSelectionTemplate = SelectionFactory(SingleSelectionPanel);
export const MutiSelectionTemplate = SelectionFactory(MutiSelectionPanel);
export const JudgeTemplate = (props)=>{
  const {que} = props;
  const {title,answer} = que;
  return (
    <div className="template flex-columm">
      <div className="template-title">
        {translateFillAndContext(title)}
      </div>
      <div className="template-margin">
        <JudgePanel answer={answer}/>
      </div>
    </div>
  )
}




const SelectionAnalysisFactory = (Comp) => class extends Component{
  render(){
    const {que} = this.props;
    const {title  , selection, correctResult, correctAnswer, userAnswer} = que;
    return (
      <div className="template flex-columm">
        <div className="template-title">
          {translateFillAndContext(title)}
        </div>
        <div className="template-margin">
          <Comp className="template-margin"
            selection={selection} correctResult={correctResult}
            correctAnswer={correctAnswer} userAnswer={userAnswer}/>
          <hr className="without-marginLR"/>
          <StandardAnalysis {...this.props}/>
        </div>
      </div>
    )
  }
}
export const SingleSelectionAnalysisTemplate = SelectionAnalysisFactory(SingleSelectionAnalysisPanel);
export const MutiSelectionAnalysisTemplate = SelectionAnalysisFactory(MutiSelectionAnalysisPanel);
export const JudgeAnalysisTemplate = (props)=>{
  const {que} = props;
  const {title, correctResult, correctAnswer, userAnswer} = que;
  return (
    <div className="template flex-columm">
      <div className="template-title">
        {translateFillAndContext(title)}
      </div>
      <div className="template-margin">
        <JudgeAnalysisPanel correctResult={correctResult}
        correctAnswer={correctAnswer} userAnswer={userAnswer}/>
        <hr/>
        <StandardAnalysis {...props}/>
      </div>
    </div>
  )
}
