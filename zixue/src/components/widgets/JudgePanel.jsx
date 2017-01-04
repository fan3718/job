require('./styles/Selection.less')
import React from 'react'
import R from 'ramda'
import classnames from 'classnames'
export const JudgePanel = (props) => {
  const {answer = []} = props
  return (
    <div className="selection-panel">
      <div className="selection-item">
        <div className={classnames('selection-item-icon','selection-item-single-icon'
                        ,{['selection-item-single-icon-active']:answer.includes('0')})}
                        data-value={0}>A</div>
                      <div className={classnames('selection-item-content','selection-item-single-icon-content'
                        ,{['selection-item-single-content-active']:answer.includes('0')})}
                        data-value={0}>false</div>
      </div>
      <div className="selection-item">
        <div className={classnames('selection-item-icon','selection-item-single-icon'
                        ,{['selection-item-single-icon-active']:answer.includes('1')})}
                        data-value={1}>B</div>
        <div className={classnames('selection-item-content','selection-item-single-icon-content'
                        ,{['selection-item-single-content-active']:answer.includes('1')})}
                        data-value={1}>true</div>
      </div>
    </div>
  )
}



export const JudgeAnalysisPanel = (props)=>{
  const {correctAnswer=[],userAnswer=[]} = props;
  const flatCorrectAnswer = R.flatten(correctAnswer);
  return (
    <div className="selection-panel">
      <div className="selection-item">
        <div className={classnames('selection-item-icon','selection-item-single-icon'
                        ,{['selection-item-single-icon-right']:flatCorrectAnswer.includes('0')})}
                        data-value={0}>A</div>
                      <div className={classnames('selection-item-content','selection-item-single-icon-content'
                        ,{['selection-item-single-content-wrong']:!flatCorrectAnswer.includes('0')&&userAnswer.includes('0')})}
                        data-value={0}>false</div>
      </div>
      <div className="selection-item">
        <div className={classnames('selection-item-icon','selection-item-single-icon'
                        ,{['selection-item-single-icon-right']:flatCorrectAnswer.includes('1')})}
                        data-value={1}>B</div>
        <div className={classnames('selection-item-content','selection-item-single-icon-content'
                        ,{['selection-item-single-content-wrong']:!flatCorrectAnswer.includes('1')&&userAnswer.includes('1')})}
                        data-value={1}>true</div>
      </div>
    </div>)
}
