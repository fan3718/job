import React ,{Component} from 'react'
import {mapTemplate} from '../map'
import {FillTemplate,SingleSelectionTemplate,JudgeTemplate} from '../templates/'
import {AnswerCartMain,SubDragableCart,Video} from '../widgets/'
import {translateContext} from '../translateMiddware'
import {addAnswer,addSingleAnswer,addSubAnswer,addSubSingleAnswer
        ,setSlickOrientation,setCurrentIndex,deleteSubAnswerSplice} from 'actions/Syncactions'
import {AddTime,SubmitQue} from '../decorator'
import R from 'ramda'
const SingleListenFactoryAddState = (Comp) =>
  @SubmitQue
  @AddTime
  class extends Component {
    _handleBlur(e){
      const answerPos = e.target.dataset.index
      const {dispatch,que} = this.props;
      const {index} = que;
      const value = e.target.value;
      dispatch(addAnswer(index,value,answerPos))
    }
    _handleTap(e){
      const {dispatch,que} = this.props;
      if(e.target.className.includes('clear-button')){
        const answerPos = e.target.dataset.index
        const {index} = que;
        dispatch(addAnswer(index,null,answerPos))
      }else if(e.target.className.includes('selection-item-single')){
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
       if(typeof que.template === 25 && que.nextIndex !== 'undefined'){
         dispatch(setCurrentIndex(que.nextIndex))
       }
     }
    render(){
      return (
        <Comp {...this.props} onTouchTap={this._handleTap.bind(this)} onBlur={this._handleBlur.bind(this)}/>
      )
    }
  }
const SingleListenFactory = (Comp) =>
  class extends Component {
    render(){
      const {que,totalNum,onTouchTap=null,onBlur = null} = this.props;
      const {queNoInPage,video} = que;
      return (
        <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
          <div className="flex-columm" onTouchTap={onTouchTap} onBlur={onBlur}>
            <Video  src={video}/>
            <Comp que={que}/>
          </div>
        </AnswerCartMain>
      )
    }
}
const SingleListenFactoryHasState = R.compose(SingleListenFactoryAddState,SingleListenFactory)


export const  SingleListenSingleSelection = SingleListenFactoryHasState(SingleSelectionTemplate)

export const  SingleListenFill = SingleListenFactoryHasState(FillTemplate)

export const  SingleListenJudge  = SingleListenFactoryHasState(JudgeTemplate)


@SubmitQue
@AddTime
export const MutiListen = class extends Component {
  constructor(props){
    super(props)
    this.state = {
      subQueIndex:0
    }
  }
  _handleSubIndexChange(index){
    this.setState({
      subQueIndex:index
    })
  }
  _handleBlur(e){
    const answerPos = e.target.dataset.index
    const {dispatch,que} = this.props;
    const {subQueIndex} = this.state;
    const {index} = que;
    const value = e.target.value;
    dispatch(addSubAnswer(index,subQueIndex,value,answerPos))
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
    return(
      <MutiListenStateless {...this.props} subQueIndex={this.state.subQueIndex} onTouchTap={this._handleTap.bind(this)}
         onBlur={this._handleBlur.bind(this)}
         notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}/>
    )
  }
}

const MutiListenStateless = (props)=>{
  const {que,totalNum,notifySubQueIndexChange=()=>{},onTouchTap=null,onBlur=null,subQueIndex} = props
  const {queNoInPage,ques,video} = que
  return (
    <div className="selection-fill-sentence  flex-columm"
      onTouchTap={onTouchTap} onBlur={onBlur}>
      <div className="ques-panel">
        {translateContext(que.title===undefined?'':que.title)}
        <Video src={video}/>
      </div>
      <SubDragableCart ques={ques}
          notifySubQueIndexChange = {notifySubQueIndexChange}
            queIndex={queNoInPage} quesNum={totalNum}>
          {mapTemplate(ques[subQueIndex])}
      </SubDragableCart>
    </div>
  )
}
