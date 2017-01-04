import React,{Component} from 'react'
import {AnswerCartMain } from '../widgets'
import {deleteAnswerSplice} from 'actions/Syncactions'
import {AddTime,SubmitQue} from '../decorator'
import {SubjectiveTemplate} from '../templates'

@SubmitQue
@AddTime
export const Subjective = class extends Component {
  _handleTap(e){
    if(e.target.className.includes('upload-button')){
      if(window.cloudApp){
        if(this.props.que.answer.length>=5){
           window.cloudApp.refuse();
        }else{
          window.cloudApp.uploadImg('-1');
        }
      }else{
        window.getImgList('-1||http://7xim7o.com2.z0.glb.qiniucdn.com/2016-06-30_16-13-05-multi_image_20160630_161304.jpg');
      }
    }else if(e.target.className.includes('upload-delete-icon')){
      const answerPos = e.target.dataset.index;
      const {que,dispatch} = this.props
      const {index} = que
      dispatch(deleteAnswerSplice(index,answerPos))
    }
  }
  render(){
    return(
      <SubjectiveStateless {...this.props} onTouchTap={this._handleTap.bind(this)}/>
    )
  }
}
export const SubjectiveStateless = (props)=>{
  const {que,totalNum,onTouchTap=null} = props
  const {queNoInPage} = que;
  return(
    <AnswerCartMain className="flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
        <div className="flex-columm" onTouchTap={onTouchTap}>
          <SubjectiveTemplate que={que}/>
        </div>
    </AnswerCartMain>
  )
}
