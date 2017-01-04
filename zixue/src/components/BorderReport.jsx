require('styles/Border.less');
import React,{Component} from 'react'
import {MainQueSlickReport} from './widgets/'
import {mapQueAnalysis} from './map'

export class BorderReport extends Component {
  render(){
    const {que,totalNum,dispatch,isGoNext} = this.props;
    return (
      <div className="border">
        <MainQueSlickReport que={que} dispatch={dispatch} isGoNext={isGoNext}>
        {mapQueAnalysis(que,totalNum,dispatch)}
        </MainQueSlickReport>
      </div>
    )
  }
}
