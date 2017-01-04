require('./styles/Animation.less')
import React,{Component,cloneElement} from 'react'
import classnames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import {AnswerCartSubDraggable,AnswerCartSub} from '../widgets/AnswerCart'
import Swipeable from 'react-swipeable'
import $ from 'jquery'
const SubSlickGen = (Comp) => class extends Component {
  constructor(prop){
    super(prop);
    this.state = {
    subQueIndex:0,
    goNext:true
    }
  }
  _handleSwipeLeft(e){
  const {ques,notifySubQueIndexChange} = this.props;
  const length = ques.length;
  const subQueIndex = this.state.subQueIndex==length-1?length-1:this.state.subQueIndex+1;
  notifySubQueIndexChange(subQueIndex);
  this.setState({
    subQueIndex,
    goNext:true
  })
  e.stopPropagation();
  }
  _handleSwipeRight(e){
    const {notifySubQueIndexChange} = this.props;
    const subQueIndex = this.state.subQueIndex==0?0:this.state.subQueIndex-1;
    notifySubQueIndexChange(subQueIndex);
    this.setState({
      subQueIndex,
      goNext:false
    })
    e.stopPropagation(e);
  }
  componentDidMount(){
    const windowHeight = $(window).height();
    const toolbarHeight = $('.panel-controller').height();
    const ctrlHeight = $('.panel-state-banner').height();
    $('#sub-answer-cart').css({
      'max-height':windowHeight-toolbarHeight-ctrlHeight
    })
  }
  componentDidUpdate(){
    const windowHeight = $(window).height();
    const toolbarHeight = $('.panel-controller').height();
    const ctrlHeight = $('.panel-state-banner').height();
    $('#sub-answer-cart').css({
      'max-height':windowHeight-toolbarHeight-ctrlHeight
    })
  }
  _handleSwipingVertical(e){
    if(e.target.className.includes('drop-button')){
      const clientY = e.targetTouches[0].clientY;
      const windowHeight = $(window).height();
      $('#sub-answer-cart').height(windowHeight-clientY);
    }
  }
  _proxyQue(e){
    return cloneElement(e,{que:this.props.ques[this.state.subQueIndex]})
  }
  render(){
    const proxyQue = React.Children.map(this.props.children, this._proxyQue.bind(this))
    const subQuesNum = this.props.ques.length;
    const {subQueIndex} = this.state;
    return (
      <Swipeable className="flex-columm" onSwipedLeft={e=>this._handleSwipeLeft(e)}
                  onSwipedRight={e=>this._handleSwipeRight(e)}
                  onSwipingUp={e=>this._handleSwipingVertical(e)}
                  onSwipingDown={e=>this._handleSwipingVertical(e)}>
         <CSSTransitionGroup className="flex-columm" transitionName={classnames({'goprev':!this.state.goNext}
                                            ,{'gonext':this.state.goNext})}
                              transitionEnterTimeout={500}
                              transitionLeaveTimeout={500}>
                  <Comp key={subQueIndex}  {...this.props} subQueIndex={subQueIndex} subQuesNum={subQuesNum} >
                    {proxyQue}
                  </Comp>
         </CSSTransitionGroup>
     </Swipeable>
    )
  }
}
export const SubDragableCart = SubSlickGen(AnswerCartSubDraggable)
export const SubCart  = SubSlickGen(AnswerCartSub)
