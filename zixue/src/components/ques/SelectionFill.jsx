require('./styles/SelectionFill.less')
import React,{Component} from 'react'
import {WordPanel} from '../widgets/WordPanel'
import {SubDragableCart} from '../widgets'
import {FillTemplate} from '../templates/'
import {addSubAnswer} from 'actions/Syncactions'
import {AddTime,SubmitQue} from '../decorator'

@SubmitQue
@AddTime
export const SelectionFillSentence = class extends Component {
  constructor(prop){
    super(prop);
    this.state = {
      subQueIndex:0
    }
  }
  _handleSubIndexChange(index){
    this.setState({
      subQueIndex:index
    })
  }
  _handleFocus(e){
    // const windowHeight = $(window).height();
    // const toolbarHeight = $('.panel-controller').height();
    // const ctrlHeight = $('.panel-state-banner').height();
    // $('#sub-answer-cart').css({
    //   'min-height':(windowHeight-toolbarHeight-ctrlHeight)*0.5
    // })
  }
  _handleBlur(e){
    const answerPos = e.target.dataset.index
    const {dispatch,que} = this.props;
    const {subQueIndex} = this.state;
    const {index} = que;
    const value = e.target.value;
    dispatch(addSubAnswer(index,subQueIndex,value,answerPos))
    // $('#sub-answer-cart').css({
    //   'min-height':0
    // })
  }
  _handleTap(e){
    if(e.target.className.includes('clear-button')){
      const answerPos = e.target.dataset.index
      const {dispatch,que} = this.props;
      const {subQueIndex} = this.state;
      const {index} = que;
      dispatch(addSubAnswer(index,subQueIndex,null,answerPos))
    }
  }
  render(){
    return (
      <SelectionFillSentenceStateless {...this.props}
        onTouchTap={this._handleTap.bind(this)}
        onFocus={this._handleFocus.bind(this)}
        onBlur={this._handleBlur.bind(this)} notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}/>
    )
  }
}

const SelectionFillSentenceStateless = class extends Component {
  constructor(prop){
    super(prop);
    this.state = {
      subQueIndex:0
    }
  }
  _handleSubIndexChange(index){
    this.setState({
      subQueIndex:index
    })
    const {notifySubQueIndexChange=()=>{}} = this.props
    notifySubQueIndexChange(index)
  }
  render(){
    const {que,totalNum,onTouchTap=null,onBlur=null,onFocus=null} = this.props
    const {queNoInPage,title,ques} = que
    return (
      <div className="selection-fill-sentence basecolor flex-columm" onTouchTap={onTouchTap} onBlur={onBlur} onFocus={onFocus}>
        <WordPanel  title={title}/>
        <SubDragableCart ques={ques} notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}  queIndex={queNoInPage} quesNum={totalNum}>
            <FillTemplate/>
        </SubDragableCart>
      </div>
    )
  }
}
