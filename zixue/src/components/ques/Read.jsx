import React ,{Component} from 'react'
import {mapTemplate} from '../map'
import {SubDragableCart} from '../widgets'
import {translateContext} from '../translateMiddware'
import {addSubAnswer,addSubSingleAnswer,deleteSubAnswerSplice} from 'actions/Syncactions'
import {SubmitQue,AddTime} from '../decorator'

@SubmitQue
@AddTime
export const Read = class extends Component {
  constructor(props){
    super(props)
    this.state = {
      subQueIndex:0
    }
  }
  _handleBlur(e){
    const answerPos = e.target.dataset.index
    const {dispatch,que} = this.props;
    const {subQueIndex} = this.state;
    const {index} = que;
    const value = e.target.value;
    dispatch(addSubAnswer(index,subQueIndex,value,answerPos))
  }
  _handleSubIndexChange(index){
    this.setState({
      subQueIndex:index
    })
  }
  _handleTap(e){
    if(e.target.className.includes('clear-button')){
      const answerPos = e.target.dataset.index
      const {dispatch,que} = this.props;
      const {subQueIndex} = this.state;
      const {index} = que;
      dispatch(addSubAnswer(index,subQueIndex,null,answerPos))
    }else if(e.target.className.includes('selection-item-single')){
      const answer = e.target.dataset.value
      const {dispatch,que} = this.props;
      const {subQueIndex} = this.state;
      const {index} = que;
      dispatch(addSubSingleAnswer(index,subQueIndex,answer))
    }else if(e.target.className.includes('upload-button')){
      if(window.cloudApp){
        if(this.props.que.answer.length>=5){
           window.cloudApp.refuse();
        }else{
          window.cloudApp.uploadImg(this.state.subIndex);
        }
      }else{
        window.getImgList(this.state.subQueIndex+'||http://7xim7o.com2.z0.glb.qiniucdn.com/2016-06-30_16-13-05-multi_image_20160630_161304.jpg');
      }
    }else if(e.target.className.includes('upload-delete-icon')){
      const answerPos = e.target.dataset.index;
      const {que,dispatch} = this.props;
      const {subQueIndex} = this.state;
      const {index} = que
      dispatch(deleteSubAnswerSplice(index,subQueIndex,answerPos))
    }
  }
  render(){
    const {que,totalNum} = this.props
    const {queNoInPage,ques} = que
    return (
        <div className="selection-fill-sentence basecolor flex-columm"
          onBlur={this._handleBlur} onTouchTap={this._handleTap.bind(this)} >
          <div className="ques-panel">{translateContext(que.title)}</div>
          <SubDragableCart ques={ques}
              notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}
              queIndex={queNoInPage} quesNum={totalNum}>
              {mapTemplate(ques[this.state.subQueIndex])}
          </SubDragableCart>
        </div>
    )
  }
}
