require('./styles/Animation.less')
import React,{Component} from 'react'
import classnames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import {setCurrentIndex ,setSlickOrientation,toogleShowCart,toogleShowAlert} from 'actions/Syncactions'
import Swipeable from 'react-swipeable'
import $ from 'jquery'
import R from 'ramda'
export class MainQueSlick extends Component {

  _handleSwipeLeft(e){
    const {que ,dispatch ,doneCount} = this.props;
    const {ques,answer} = que;
    if(typeof que.id !=='undefined' && que.id !==null){
      let answered;
      if(typeof ques !=='undefined' && ques.length > 0){
        let aQuesanswer = []
        aQuesanswer = R.compose(R.flatten,R.map(R.prop('answer')))(ques)
        if(typeof que.quesType==='undefined'){
          answered = doneCount>0
        }else{
          answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
        }
      }else{
        answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
      }
      if(typeof que.nextIndex !=='undefined'){
        dispatch(setSlickOrientation(true));
        if(answered){
          dispatch(setCurrentIndex(que.nextIndex))
        }else{
          dispatch(toogleShowAlert())
        }
      }else if(answered){
        dispatch(toogleShowCart())
      }else{
        dispatch(toogleShowAlert())
      }
    }else{
      if(typeof que.nextIndex !== 'undefined'){
        dispatch(setSlickOrientation(true));
        dispatch(setCurrentIndex(que.nextIndex))
      }else{
        dispatch(toogleShowCart())
      }
    }
    e.stopPropagation();
  }
  _handleSwipeRight(e){
    const {que ,dispatch ,doneCount} = this.props;
    const {ques,answer} = que;
    if(typeof que.id !=='undefined' && que.id !==null){
      let answered;
      if(typeof ques !=='undefined' && ques.length > 0){
        let aQuesanswer = []
        aQuesanswer = R.compose(R.flatten,R.map(R.prop('answer')))(ques)
        if(typeof que.quesType==='undefined'){
          answered = doneCount>0
        }else{
          answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(aQuesanswer)
        }
      }else{
        answered = !R.all(e=>e==''||e==null||typeof e=='undefined')(answer)
      }
      if(typeof que.preIndex !== 'undefined'){
        dispatch(setSlickOrientation(false));
        if(answered){
          dispatch(setCurrentIndex(que.preIndex))
        }else{
          dispatch(toogleShowAlert())
        }
      }else if(answered){
        dispatch(toogleShowCart())
      }else{
        dispatch(toogleShowAlert())
      }
    }else{
      if(typeof que.preIndex !== 'undefined'){
        dispatch(setSlickOrientation(false));
        dispatch(setCurrentIndex(que.preIndex))
      }else{
        dispatch(toogleShowCart())
      }
    }
    e.stopPropagation(e);
  }
  render(){
    const {isGoNext} = this.props;
    return(
      <Swipeable className="flex-columm" onSwipedLeft={e=>this._handleSwipeLeft(e)}
                  onSwipedRight={e=>this._handleSwipeRight(e)}
                  >
         <CSSTransitionGroup className="flex-columm silder-animation"
                  transitionName={classnames({'goprev':!isGoNext}
                                            ,{'gonext':isGoNext})}
                              transitionEnterTimeout={300}
                              transitionLeaveTimeout={300}>
                              {this.props.children}
          </CSSTransitionGroup>
      </Swipeable>
    )
  }
}
