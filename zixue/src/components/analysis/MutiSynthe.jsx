import React ,{Component} from 'react'
import {mapTemplateAnalysis} from '../map'
import {SubDragableCart} from '../widgets'
import {translateContext} from '../translateMiddware'

export const MutiSynthe = class extends Component {
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
  render(){
    const {que,totalNum,onBlur,onTouchEnd} = this.props
    const {queNoInPage,ques,knowledges,usetime} = que
    return (
      <div className="selection-fill-sentence basecolor flex-columm"
        onTouchEnd={onTouchEnd} onBlur={onBlur}>
        <div className="ques-panel">{translateContext(que.title)}</div>
        <SubDragableCart ques={ques}
            notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}
              queIndex={queNoInPage} quesNum={totalNum}>
            {mapTemplateAnalysis(ques[this.state.subQueIndex],knowledges,usetime)}
        </SubDragableCart>
      </div>
    )
  }
}
