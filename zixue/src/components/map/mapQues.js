import React from 'react'
import {SelectionFillSentence,Fill,SingleSelection,
        Subjective,DescriptionCart,Read,
        Connection,ClozeContent,MutiSynthe,MutiSelection,Judge,
        SingleListenFill,SingleListenJudge,
        SingleListenSingleSelection,MutiListen,
        SevenSelectFive} from '../ques'
import {SingleSelectionTemplate
        ,FillTemplate ,MutiSelectionTemplate,JudgeTemplate,SubjectiveTemplate} from '../templates'
/**
 * quesGroups下ques层，整题题型模板选择
 */
export const mapQue = (que,totalNum,dispatch,isShowCart)=>{
  if(typeof que.desc !=='undefined'){
    return <DescriptionCart key={que.shortName+que.desc} desc={que.desc} shortName={que.shortName}/>
  }
  switch (que.template) {
    case 1:
      return <SingleSelection isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 2:
    case 3:
    case 4:
      return <MutiSelection  isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 5:
      return mapFillTemplate(que,totalNum,dispatch,isShowCart)
    case 6:
      return <Judge  isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 7:
      return <Subjective isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 8:
    case 9:
      return <MutiSynthe isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 12:
      return <ClozeContent isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 13:
      return <Connection isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 14:
      return <SevenSelectFive isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 15:
      return <Subjective isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 16:
      return <Read isShowCart={isShowCart}  key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 19:
      return <MutiListen isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 21:
      return <SelectionFillSentence isShowCart={isShowCart}  key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 22://补全对话（其他）
      return <Subjective isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 23:
      return <SingleListenFill isShowCart={isShowCart}  key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 24:
      return <SingleListenJudge isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    case 25:
      return <SingleListenSingleSelection isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    default:
      return <div></div>
  }
}
/**
 * 填空题模板的题目类型选择
 */
const mapFillTemplate = (que,totalNum,dispatch,isShowCart)=>{
  switch (que.quesType) {
    case 56:
      return <Connection  isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
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
    case 58:
    case 64:
    case 66:
    case 67:
    case 68:
    case 82:
    case 83:
    case 84:
      return <Fill  isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
    default:
      return <Subjective  isShowCart={isShowCart} key={que.id} que={que} totalNum={totalNum} dispatch={dispatch}/>
  }
}
/**
 * 整题下ques层，即小题显示模板选择
 */
export const mapTemplate = (que) => {
  switch (que.template) {
    case 1:
      return <SingleSelectionTemplate que={que}/>
    case 2:
    case 3:
    case 4:
      return <MutiSelectionTemplate que={que}/>
    case 5:
      return <FillTemplate  que={que}/>
    case 6:
      return <JudgeTemplate que={que}/>
    case 7:
      return <SubjectiveTemplate que={que}/>
    default:
      return <div>{'没有这个模板'}</div>
  }
}
