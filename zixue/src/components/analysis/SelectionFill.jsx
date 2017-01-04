require('./styles/SelectionFill.less')
import React,{Component} from 'react'
import {WordPanel} from '../widgets/WordPanel'
import {SubDragableCart} from '../widgets'
import {FillAnalysisTemplate} from '../templates/'
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
    const {notifySubQueIndexChange=()=>{}} = this.props
    notifySubQueIndexChange(index)
  }
  render(){
    const {que,totalNum} = this.props
    const {queNoInPage,title,ques,usetime,knowledges} = que
    return (
      <div className="selection-fill-sentence basecolor flex-columm">
        <WordPanel  title={title}/>
        <SubDragableCart ques={ques} notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}  queIndex={queNoInPage} quesNum={totalNum}>
          <FillAnalysisTemplate usetime={usetime} knowledges={knowledges}/>
        </SubDragableCart>
      </div>
    )
  }
}
