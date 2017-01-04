import React ,{Component} from 'react'
import {AnswerCartMain} from '../widgets/'
import {FillAnalysisTemplate} from '../templates'
export const Fill = class extends Component {
  render(){
    const {que,totalNum,onTouchEnd=null,onBlur=null} = this.props
    const {queNoInPage} = que
    return (
      <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <div className="flex-columm" onTouchEnd={onTouchEnd} onBlur={onBlur}>
          <FillAnalysisTemplate que={que}/>
        </div>
      </AnswerCartMain>
    )
  }
}
