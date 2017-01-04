require('styles/Border.less');
import React,{Component} from 'react'
import {MainQueSlick} from './widgets/'
import {mapQue} from './map'

export class Border extends Component {
  render(){
    const {que,totalNum,dispatch,isGoNext,isShowCart} = this.props;
    return (
      <div className="border">
        <MainQueSlick que={que} dispatch={dispatch} isGoNext={isGoNext}>
        {mapQue(que,totalNum,dispatch,isShowCart)}
        </MainQueSlick>
      </div>
    )
  }
}
