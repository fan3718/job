import React ,{Component} from 'react'
import {mapTemplateAnalysis} from '../map'
import {FillAnalysisTemplate,SingleSelectionAnalysisTemplate,JudgeAnalysisTemplate} from '../templates/'
import {AnswerCartMain,SubDragableCart,Video,StandardAnalysis} from '../widgets/'
import {translateContext} from '../translateMiddware'
import {addAnswer,addSingleAnswer,addSubAnswer,addSubSingleAnswer} from 'actions/Syncactions'
import R from 'ramda'
const SingleListenFactoryAddState = (Comp) =>
  class extends Component {
    render(){
      return (
        <Comp {...this.props} />
      )
    }
  }
const SingleListenFactory = (Comp) =>
  class extends Component {
    render(){
      const {que,totalNum} = this.props;
      const {queNoInPage,video} = que;
      return (
        <AnswerCartMain className="fill flex-columm" queIndex={queNoInPage} quesNum={totalNum}>
          <div className="flex-columm" >
            <Video src={video}/>
            <Comp que={que}/>
          </div>
        </AnswerCartMain>
      )
    }
}
const SingleListenFactoryHasState = R.compose(SingleListenFactoryAddState,SingleListenFactory)


export const  SingleListenSingleSelection = SingleListenFactoryHasState(SingleSelectionAnalysisTemplate)

export const  SingleListenFill = SingleListenFactoryHasState(FillAnalysisTemplate)

export const  SingleListenJudge  = SingleListenFactoryHasState(JudgeAnalysisTemplate)



export const MutiListen = class extends Component {
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
    return(
      <MutiListenStateless {...this.props} subQueIndex={this.state.subQueIndex}
         notifySubQueIndexChange={this._handleSubIndexChange.bind(this)}/>
    )
  }
}

const MutiListenStateless = (props)=>{
  const {que,totalNum,notifySubQueIndexChange=()=>{},subQueIndex} = props
  const {queNoInPage,ques,video} = que
  return (
    <div className="selection-fill-sentence  flex-columm">
      <div className="ques-panel">
        {translateContext(que.title===undefined?'':que.title)}
        <Video src={video}/>
      </div>
      <SubDragableCart ques={ques}
          notifySubQueIndexChange = {notifySubQueIndexChange}
            queIndex={queNoInPage} quesNum={totalNum}>
          {mapTemplateAnalysis(ques[subQueIndex])}
      </SubDragableCart>
    </div>
  )
}
