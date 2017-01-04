require('normalize.css/normalize.css');
require('styles/App.less');
require('babel-polyfill')
import React from 'react';
import classnames from 'classnames'
import {connect} from 'react-redux'
import {Cart} from 'components/widgets/Cart'
import {toogleShowCart, setCurrentIndex,canSubmit,toogleShowAlert,setSlickOrientation} from 'actions/Syncactions'
import {fetchQueIfNeed} from 'actions/FetchQue'
import {getNode,isQueNode} from '../utils/'
import {Border} from './Border'
import {MaskBox} from './widgets/'
import $ from 'jquery'
import R from 'ramda'
const filterAnswerJson = (que) =>{
  if(typeof que.ques ==='undefined'){
    const ques = R.map(R.pick(['id','answer']))(que.ques)
    const id = que.id
    return {id,ques}
  }else{
    return R.pick(['id','answer'])(que)
  }
}
class AppComponent extends React.Component {
  _handleTap(e){
    const {dispatch,currentIndex,page} = this.props;
    const {totalNum} = page;
    if(e.target.className.includes('panel-icon-show-cart')){
      dispatch(toogleShowCart());
      // if(typeof　totalNum === $(".cart-ques-group-item-answered").length){
      //   dispatch(canSubmit());
      // }
    }else if(e.target.className.includes('cart-ques-group-item')){
      const quesId = e.target.dataset.id;
      const index = e.target.dataset.index;
      dispatch(fetchQueIfNeed(quesId,true,true,index))
      dispatch(toogleShowCart());
      dispatch(setCurrentIndex(index));
    }else if(e.target.className.includes('panel-icon-return')){
      const postParams = {
        uid:window.uid,
        examId:window.examId,
        key:window.key,
        sign:window.sign,
        subject:window.subject
      }
      if(isQueNode(currentIndex,page)){
        const que = getNode(currentIndex,page);
        const answerJson = JSON.stringify(filterAnswerJson(que));
        const {usetime:duration,id:quesId} = que
        const postParamsQue = R.merge(postParams,{answerJson,quesId,duration})
        $.post('/selfstudy/exam/ques/commit',postParamsQue)
      }
      window.cloudApp.goBack();
    }else if(e.target.className.includes('cart-submit-button-active')){
      const postParams = {
        uid:window.uid,
        examId:window.examId,
        exerId:window.exerId,
        key:window.key,
        sign:window.sign,
        subject:window.subject
      }
      if(isQueNode(currentIndex,page)){
        const que = getNode(currentIndex,page);
        const answerJson = JSON.stringify(filterAnswerJson(que));
        const {usetime:duration,id:quesId} = que
        const postParamsQue = R.merge(postParams,{answerJson,quesId,duration})
        $.post('/selfstudy/exam/ques/commit',postParamsQue,()=>{
          $.post('/selfstudy/exam/commit',postParams)
        })
      }else {
        $.post('/selfstudy/exam/commit',postParams)
      }
      window.cloudApp.submit();
    }else if(e.target.className.includes('alert-skip-answer')){
      const {isGoNext} = this.props;
      const que = getNode(currentIndex,page);
      dispatch(toogleShowAlert())
      if(typeof que.preIndex !== 'undefined' && isGoNext === false){
        dispatch(setCurrentIndex(que.preIndex))
      }else if(typeof que.nextIndex !== 'undefined' && isGoNext === true){
        dispatch(setCurrentIndex(que.nextIndex))
      }else{
        dispatch(toogleShowCart())
      }
    }else if(e.target.className.includes('alert-continue-answer')){
      dispatch(toogleShowAlert())
    }
  }
  componentDidUpdate(){
    const {dispatch,currentIndex,page} = this.props;
    const que = getNode(currentIndex,page);
    const {preIndex, nextIndex} = que;
    if(isQueNode(currentIndex,page)){
      dispatch(fetchQueIfNeed(que.id,true,true,currentIndex))
    }
    if(typeof preIndex!=='undefined'&&isQueNode(preIndex,page)){
      const preQue = getNode(preIndex,page);
      dispatch(fetchQueIfNeed(preQue.id,true,true,preIndex))
    }
    if(typeof nextIndex!=='undefined'&&isQueNode(nextIndex,page)){
      const nextQue = getNode(nextIndex,page);
      dispatch(fetchQueIfNeed(nextQue.id,true,true,nextIndex))
    }
    if(typeof　nextIndex ==='undefined'){
      dispatch(canSubmit());
    }
  }
  render() {
    const {page,isShowCart,currentIndex,dispatch,canSubmit,isGoNext,isShowAlert} = this.props
    const {totalNum = 0} = page
    const que = getNode(currentIndex,page)
    return (
      <div className="panel" onTouchEnd={e=>this._handleTap(e)}>
        <div className="panel-state-banner"></div>
        <div className="panel-controller">
					<div className="panel-icon-return"></div>
          <span className={classnames({'content-show':isShowCart})}>答题卡</span>
					<div className="panel-icon-show-cart" id="toggle-show-chat"></div>
				</div>
        <div className="panel-border">
            <div className="panel-border-que">
              <Border totalNum={totalNum} que={que} isShowCart={isShowCart} isGoNext={isGoNext} dispatch={dispatch}/>
            </div>
            <div className={classnames('panel-border-cart'
                            ,{'panel-border-cart-show':isShowCart
                            ,'panel-border-cart-hide':!isShowCart})} >
                <Cart page={page} canSubmit={canSubmit}/>
            </div>
        </div>
        <MaskBox isShowAlert={isShowAlert} isGoNext={isGoNext} dispatch={dispatch}></MaskBox>
      </div>
    );
  }
}

function select(state){
  return {
    isShowCart:state.isShowCart,
    isShowAlert:state.isShowAlert,
    currentIndex:state.currentIndex,
    canSubmit:state.canSubmit,
    page:state.page,
    isGoNext:state.isGoNext
  }
}
export default connect(select)(AppComponent);
