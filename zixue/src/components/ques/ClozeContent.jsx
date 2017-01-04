import React ,{Component} from 'react'
import {SubDragableCart} from '../widgets'
import {translateContext} from '../translateMiddware'
import {addSubSingleAnswer} from 'actions/Syncactions'
import {SubmitQue,AddTime} from '../decorator'
import {SingleSelectionTemplate} from '../templates'
import R from 'ramda'
@SubmitQue
@AddTime
export const ClozeContent = class extends Component {
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
  _handleTap(e){
    if(e.target.className.includes('selection-item-single')){
        const answer = e.target.dataset.value
        const {dispatch,que} = this.props;
        const {subQueIndex} = this.state;
        const {index} = que;
        dispatch(addSubSingleAnswer(index,subQueIndex,answer))
    }
  }
  render(){
    return (
      <ClozeContentStateless onTouchTap={this._handleTap.bind(this)} {...this.props} handleSubIndexChange={this._handleSubIndexChange.bind(this)}/>
    )
  }
}


export const ClozeContentStateless = (props) => {
  const {que,totalNum,handleSubIndexChange,onTouchTap} = props
  const {queNoInPage,ques} = que
  const answer = R.compose(R.flatten,R.map(R.compose(e=>e.length===0?['']:e,R.prop('answer'))))(ques)
  return (
    <div className="selection-fill-sentence basecolor flex-columm"
      onTouchTap={onTouchTap} >
      <div className="ques-panel">{translateContext(que.title,answer)}</div>
      <SubDragableCart ques={ques}
          notifySubQueIndexChange={handleSubIndexChange}
            queIndex={queNoInPage} quesNum={totalNum}>
          <SingleSelectionTemplate que={que}/>
      </SubDragableCart>
    </div>
  )
}
