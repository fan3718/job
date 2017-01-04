require('./styles/Animation.less')
import React,{Component} from 'react'
import classnames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import {setCurrentIndex ,setSlickOrientation,toogleShowCart} from 'actions/Syncactions'
import Swipeable from 'react-swipeable'
import $ from 'jquery'
export class MainQueSlickReport extends Component {

  _handleSwipeLeft(e){
    const {que ,dispatch} = this.props;
    if(typeof que.nextIndex !== 'undefined'){
      dispatch(setSlickOrientation(true));
      dispatch(setCurrentIndex(que.nextIndex))
    }else{
      console.info("--------------已经是最后一页了------------------")
    }
    e.stopPropagation();
  }
  _handleSwipeRight(e){
    const {que ,dispatch} = this.props;
    if(typeof que.preIndex !== 'undefined'){
      dispatch(setSlickOrientation(false));
      dispatch(setCurrentIndex(que.preIndex))
    }else{
      console.info("--------------已经是第一页了------------------")
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
