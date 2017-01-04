import React ,{Component} from 'react'
import {AntiSelectionPanel} from '../widgets'
import {translateContext} from '../translateMiddware'
import {addAnswerRemoveRepeat} from 'actions/Syncactions'
import {AnswerCartSubDraggableWithoutSubInfo} from '../widgets/AnswerCart'
import Swipeable from 'react-swipeable'
import {AddTime,SubmitQue} from '../decorator'
import $ from 'jquery'
@SubmitQue
@AddTime
export const SevenSelectFive = class extends Component {
  constructor(props){
    super(props)
    this.state = {
      index:0
    }
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
  _handleFocus(e){
    this.setState({
      index:e.target.dataset.index
    })
  }
  _handleTap(e){
     if(e.target.className.includes('selection-item-anti')){
          const answer = e.target.dataset.value
          const {dispatch,que} = this.props;
          const {index} = que;
          const {index:answerPos} = this.state
          dispatch(addAnswerRemoveRepeat(index,answer,answerPos))
      }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.index !== this.state.index){
      return false;
    }
    return true;
  }
  render(){
    const {que,totalNum} = this.props
    const {queNoInPage,selection,answer} = que
    return (
      <div className="selection-fill-sentence basecolor flex-columm" onFocus={this._handleFocus.bind(this)}
        onClick={e=>this._handleTap(e)} >
        <div className="ques-panel">{translateContext(que.title,que.answer)}</div>
        <Swipeable className="flex-columm"
                onSwipingUp={e=>this._handleSwipingVertical(e)}
                onSwipingDown={e=>this._handleSwipingVertical(e)}>
                <AnswerCartSubDraggableWithoutSubInfo  queIndex={queNoInPage}
                    quesNum={totalNum} >
                  <div className="margin-lr" >
                    <AntiSelectionPanel className="margin-lr" selection={selection} answer={answer}/>
                  </div>
                </AnswerCartSubDraggableWithoutSubInfo>
        </Swipeable>
      </div>
    )
  }
}
