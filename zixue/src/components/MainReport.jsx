require('normalize.css/normalize.css');
require('styles/App.less');
require('babel-polyfill')
import React from 'react';
import {connect} from 'react-redux'
import {toogleShowCart, setCurrentIndex,canSubmit} from 'actions/Syncactions'
import {fetchQueIfNeed} from 'actions/FetchQue'
import {getNode,isQueNode} from '../utils/'
import {BorderReport} from './BorderReport'
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
    if(e.target.className.includes('panel-icon-show-cart')){
      dispatch(toogleShowCart());
    }else if(e.target.className.includes('cart-ques-group-item')){
      const quesId = e.target.dataset.id;
      const index = e.target.dataset.index;
      dispatch(fetchQueIfNeed(quesId,true,true,index))
      dispatch(toogleShowCart());
      dispatch(setCurrentIndex(index));
    }else if(e.target.className.includes('panel-icon-return')){
      window.cloudApp.goBack();
    }
  }
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(setCurrentIndex(window.index||'0-0-0'))
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
    const {page,isShowCart,currentIndex,dispatch,canSubmit,isGoNext} = this.props
    const {totalNum = 0} = page
    const que = getNode(currentIndex,page)
    return (
      <div className="panel" onTouchTap={e=>this._handleTap(e)}>
        <div className="panel-state-banner"></div>
        <div className="panel-controller">
					<div className="panel-icon-return"></div>
					{/* <div className="panel-icon-show-cart" id="toggle-show-chat"></div> */}
				</div>
        <div className="panel-border">
            <div className="panel-border-que">
              <BorderReport totalNum={totalNum} que={que} isGoNext={isGoNext} dispatch={dispatch}/>
            </div>
            {/* <div className={classnames('panel-border-cart'
                            ,{'panel-border-cart-show':isShowCart
                            ,'panel-border-cart-hide':!isShowCart})} >
                <Cart page={page} canSubmit={canSubmit}/>
            </div> */}
        </div>
      </div>
    );
  }
}

function select(state){
  return {
    isShowCart:state.isShowCart,
    currentIndex:state.currentIndex,
    canSubmit:state.canSubmit,
    page:state.page,
    isGoNext:state.isGoNext

  }
}
export default connect(select)(AppComponent);
