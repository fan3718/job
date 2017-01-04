require('./styles/Selection.less')
import React from 'react'
import  classnames from 'classnames'
import  R from 'ramda'
/**
 * 生成单选多选反选样式
 * @method
 * @param  {Number} type 生成样式(1.单选 2.多选 3.反选)
 * @return {React stateless Component}      选择题样式
 */
const SelectionPanelFactory = (type) => {
  return (props) => {
    let {selection={}, answer=[]} = props;
    let selectionKey  = R.keys(selection)
    return (
      <div className="selection-panel">
        {
          R.map(k=>{
            return (<SelectItem  type={type} isSelected={answer.includes(k)}  key={k}
               item={k} content={selection[k]}/>)
           })(selectionKey)
        }
      </div>
    )
  }
}
const SelectItem = (props) => {
  const {type,isSelected,item,content} = props;
  const baseString = typeSelected(type);
  return (
    <div className="selection-item" data-value={item}>
      <div className={classnames('selection-item-icon',baseString+'-icon'
                      ,{[baseString+'-icon-active']:isSelected})}
                      data-value={item}>{item}</div>
      <div className={classnames('selection-item-content',baseString+'-content'
                      ,{[baseString+'-content-active']:isSelected})}
                      data-value={item} dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}
/**
 * 根据type生成类名字符串
 * @method
 * @param  {Number} type 生成样式(1.单选 2.多选 3.反选)
 * @return {String}      样式字符串
 */
const typeSelected = (type) =>{
  if(type===1){
    return 'selection-item-single'
  }else if(type===2){
    return 'selection-item-muti'
  }else if(type===3){
    return 'selection-item-anti'
  }
}
export const SingleSelectionPanel = SelectionPanelFactory(1);
export const MutiSelectionPanel = SelectionPanelFactory(2);
export const AntiSelectionPanel = SelectionPanelFactory(3);










const SelectionAnalysisPanelFactory = (type) => {
  return (props) => {
    let {selection={}} = props;
    let {correctAnswer=[],userAnswer=[]} = props;
    let flatCorrectAnswer = R.flatten(correctAnswer);
    let selectionKey  = R.keys(selection)
    return (
      <div className="selection-panel">
        {
          R.map(k=>{
            return (<SelectAnalysisItem  type={type} isAnswered={userAnswer.includes(k)} isRight={flatCorrectAnswer.includes(k)}  key={k}
               item={k} content={selection[k]}/>)
           })(selectionKey)
        }
      </div>
    )
  }
}
const SelectAnalysisItem = (props) => {
  const {type,isAnswered,isRight,item,content} = props;
  const baseString = typeSelected(type);
  return (
    <div className="selection-item" data-value={item}>
      <div className={classnames('selection-item-icon',baseString+'-icon'
                      ,{[baseString+'-icon-right']:isRight})}
                      data-value={item}>{item}</div>
      <div className={classnames('selection-item-content',baseString+'-content'
                      ,{[baseString+'-content-wrong']:isAnswered&&!isRight})}
                      data-value={item} dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}


export const SingleSelectionAnalysisPanel = SelectionAnalysisPanelFactory(1);
export const MutiSelectionAnalysisPanel = SelectionAnalysisPanelFactory(2);
export const AntiSelectionAnalysisPanel = SelectionAnalysisPanelFactory(3);
