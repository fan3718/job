import React ,{Component} from 'react'
import {FillTemplate} from '../templates/'
import {AnswerCartMain} from '../widgets/'
import {addAnswer} from 'actions/Syncactions'
import {AddTime,SubmitQue} from '../decorator'
@SubmitQue
@AddTime
export class Fill extends Component {
  _handleBlur(e){
    const answerPos = e.target.dataset.index
    const {dispatch,que} = this.props;
    const {index} = que;
    const value = e.target.value;
    dispatch(addAnswer(index,value,answerPos))
  }
  _handleTap(e){
    if(e.target.className.includes('clear-button')){
      const answerPos = e.target.dataset.index
      const {dispatch,que} = this.props;
      const {index} = que;
      dispatch(addAnswer(index,null,answerPos))
    }
  }
  render(){
    return (
        <FillStateless {...this.props} onTouchTap={this._handleTap.bind(this)} onBlur={this._handleBlur.bind(this)}/>
    )
  }
}
const FillStateless  = class extends Component{
  render(){
    const {que,totalNum,onTouchTap=null,onBlur=null} = this.props
    const {queNoInPage} = que
    return (
      <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <div className="flex-columm" onTouchTap={onTouchTap} onBlur={onBlur}>
          <FillTemplate que={que}/>
        </div>
      </AnswerCartMain>
    )
  }
}
