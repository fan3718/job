import React,{Component} from 'react'
import {JudgeTemplate} from '../templates'
import {AnswerCartMain} from '../widgets/'
import {addSingleAnswer,setCurrentIndex,setSlickOrientation} from 'actions/Syncactions'
import {AddTime,SubmitQue} from '../decorator'
import R from 'ramda'
@SubmitQue
@AddTime
export class Judge extends Component {
  _handleTap(e){
    if(e.target.className.includes('selection-item')){
      const selectionItem  = e.target.dataset.value;
      const {que,dispatch} = this.props;
      const {index} = que;
      dispatch(setSlickOrientation(true))
      dispatch(addSingleAnswer(index,selectionItem))
    }
  }
 shouldComponentUpdate(nextProps){
   return !R.equals(this.props.que.answer,nextProps.que.answer)

 }
  componentDidUpdate(){
    const {que,dispatch} = this.props;
    if(typeof que.nextIndex !== 'undefined'){
      dispatch(setCurrentIndex(que.nextIndex))
    }
  }
  render(){
    return (
      <JudgeStateless onTouchTap={this._handleTap.bind(this)} {...this.props}/>
    )
  }
}


const JudgeStateless = (props) => {
  const {que,totalNum,onTouchTap} = props
  const {queNoInPage} = que
  return (
    <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
      <div className="flex-columm" onTouchTap={onTouchTap}>
        <JudgeTemplate que={que}/>
      </div>
    </AnswerCartMain>
  )
}
